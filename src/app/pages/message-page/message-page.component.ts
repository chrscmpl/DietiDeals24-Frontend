import { Component, OnInit } from '@angular/core';
import { Auction } from '../../models/auction.model';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { NavigationService } from '../../services/navigation.service';
import { UserMessagingService } from '../../services/user-messaging.service';
import { Message } from '../../models/message.model';

interface MessageForm {
    message: FormControl<string | null>;
}

@Component({
    selector: 'dd24-message-page',
    standalone: true,
    imports: [
        AsyncPipe,
        CurrencyPipe,
        InputComponent,
        InputTextareaModule,
        ReactiveFormsModule,
        ButtonModule,
    ],
    templateUrl: './message-page.component.html',
    styleUrl: './message-page.component.scss',
})
export class MessagePageComponent implements OnInit {
    public messageForm!: FormGroup<MessageForm>;
    public auction!: Auction;
    public isReport = false;
    public submissionLoading = false;

    public readonly environment = environment;

    public constructor(
        private readonly route: ActivatedRoute,
        public readonly authentication: AuthenticationService,
        private readonly formBuilder: FormBuilder,
        private readonly toastMessage: MessageService,
        public readonly navigation: NavigationService,
        private readonly messagingService: UserMessagingService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
        });

        this.route.queryParams.pipe(take(1)).subscribe((params) => {
            if (params['report'] === 'true') {
                this.switchToReport();
            }
        });

        this.messageForm = this.formBuilder.group({
            message: new FormControl<string | null>(null),
        });
    }

    public send(): void {
        if (!this.messageForm.controls.message.value?.length) {
            this.showEmptyMessageError();
            return;
        }

        const message: Message = {
            message: this.messageForm.controls.message.value,
            auctionId: this.auction.id,
        };

        this.submissionLoading = true;
        (this.isReport
            ? this.messagingService.sendReport(message)
            : this.messagingService.sendMessage(message)
        ).subscribe({
            next: this.onSendSuccess.bind(this),
            error: this.onSendError.bind(this),
        });
    }

    private onSendSuccess(): void {
        this.submissionLoading = false;
        this.toastMessage.add({
            severity: 'success',
            summary: 'Success',
            detail: `Your ${
                this.isReport ? 'report' : 'message'
            } has been successfully sent`,
        });

        this.messageForm.controls.message.setValue(null);
    }

    private onSendError(): void {
        this.submissionLoading = false;
        this.toastMessage.add({
            severity: 'error',
            summary: 'Error',
            detail: `An error occurred while sending your ${
                this.isReport ? 'report' : 'message'
            }, please try again later`,
        });
    }

    public switchToReport(): void {
        this.isReport = true;
    }

    public switchToMessage(): void {
        this.isReport = false;
    }

    private showEmptyMessageError(): void {
        this.toastMessage.add({
            severity: 'error',
            summary: 'Error',
            detail: `You can\t send an empty ${
                this.isReport ? 'report' : 'message'
            }!`,
        });
    }
}
