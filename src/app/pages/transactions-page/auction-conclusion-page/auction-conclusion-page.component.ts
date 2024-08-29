import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuctionCardComponent } from '../../../components/auction-card/auction-card.component';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { WindowService } from '../../../services/window.service';
import { Auction } from '../../../models/auction.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { TimerComponent } from '../../../components/timer/timer.component';
import { environment } from '../../../../environments/environment';
import { UserPreviewComponent } from '../../../components/user-preview/user-preview.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavigationService } from '../../../services/navigation.service';
import { AuctioneerService } from '../../../services/auctioneer.service';
import { AuctionConclusionOptions } from '../../../enums/auction-conclusion-options.enum';

@Component({
    selector: 'dd24-auction-conclusion-page',
    standalone: true,
    imports: [
        ButtonModule,
        AuctionCardComponent,
        AsyncPipe,
        TimerComponent,
        CurrencyPipe,
        UserPreviewComponent,
        RouterLink,
    ],
    templateUrl: './auction-conclusion-page.component.html',
    styleUrl: './auction-conclusion-page.component.scss',
})
export class AuctionConclusionPageComponent implements OnInit {
    public auction!: Auction;
    public endTime!: Date;

    public constructor(
        public readonly windowService: WindowService,
        private readonly route: ActivatedRoute,
        private readonly confirmation: ConfirmationService,
        private readonly navigation: NavigationService,
        private readonly auctioneerService: AuctioneerService,
        private readonly message: MessageService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
            this.endTime = new Date(
                this.auction.endTime.getTime() + environment.auctionPendingTime,
            );
        });
    }

    public showRejectDialog(): void {
        this.confirmation.confirm({
            header: 'Are you sure?',
            message:
                "Are you sure you want to reject this auction? You won't be able to undo this action.",
            dismissableMask: true,
            closeOnEscape: true,
            acceptButtonStyleClass: 'p-button-danger',
            accept: this.onReject.bind(this),
        });
    }

    private onReject(): void {
        this.auctioneerService
            .concludeAuction({
                auctionId: this.auction.id,
                choice: AuctionConclusionOptions.reject,
            })
            .pipe(take(1))
            .subscribe({
                next: this.onRejectSuccess.bind(this),
                error: this.onRejectError.bind(this),
            });
    }

    private onRejectSuccess() {
        this.message.add({
            severity: 'success',
            summary: 'Auction rejected',
            detail: 'The auction has been successfully rejected.',
        });
        this.navigation.back();
    }

    private onRejectError() {
        this.message.add({
            severity: 'error',
            summary: 'Auction rejection failed',
            detail: 'An error occurred while rejecting the auction. Try again later.',
        });
    }
}
