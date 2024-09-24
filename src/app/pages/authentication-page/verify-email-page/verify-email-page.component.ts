import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { InputOtpModule } from 'primeng/inputotp';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputComponent } from '../../../components/input/input.component';
import { MaskedPipe } from '../../../pipes/masked.pipe';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils.helper';
import { MessageService } from 'primeng/api';
import { NavigationService } from '../../../services/navigation.service';
import { EmailVerificationException } from '../../../exceptions/email-verification.exception';
import { GetAuthenticatedUserDataException } from '../../../exceptions/get-authenticated-user-data.exception';
import { emailVerificationData } from '../../../models/email-verification-data.model';

interface verificationForm {
    code: FormControl<string | null>;
    email: FormControl<string | null>;
}

@Component({
    selector: 'dd24-verify-email-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputOtpModule,
        ButtonModule,
        InputComponent,
        MaskedPipe,
    ],
    templateUrl: './verify-email-page.component.html',
    styleUrl: './verify-email-page.component.scss',
})
export class VerifyEmailPageComponent implements OnInit {
    public verificationForm!: FormGroup<verificationForm>;
    public showEmail: boolean = false;
    public submissionLoading: boolean = false;

    public constructor(
        private readonly authentication: AuthenticationService,
        private readonly formBuilder: FormBuilder,
        private readonly navigation: NavigationService,
        private readonly message: MessageService,
    ) {}

    public ngOnInit(): void {
        if (!this.authentication.emailToVerify) {
            this.navigation.back();
            return;
        }
        this.verificationForm = this.formBuilder.group<verificationForm>({
            code: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(5),
                ],
                updateOn: 'submit',
            }),
            email: new FormControl(this.authentication.emailToVerify, [
                Validators.required,
            ]),
        });
    }

    public toggleEmailVisibility(): void {
        this.showEmail = !this.showEmail;
    }

    public onSubmit(): void {
        if (this.verificationForm.invalid) {
            this.onInvalidForm();
            return;
        }

        this.submissionLoading = true;

        this.authentication.verifyEmail(
            this.verificationForm.value as emailVerificationData,
            {
                next: this.onVerificationSuccess.bind(this),
                error: this.onVerificationError.bind(this),
            },
        );
    }

    public onKeyPressed(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onSubmit();
        }
    }

    private onInvalidForm(): void {
        reactiveFormsUtils.markAllAsDirty(this.verificationForm);
    }

    private onVerificationSuccess(): void {
        this.navigation.navigateToRouteBeforeRedirection();
    }

    private onVerificationError(
        e: EmailVerificationException | GetAuthenticatedUserDataException,
    ): void {
        this.submissionLoading = false;
        if (e.error.status >= 500) {
            this.displayError('Server error', 'Please try again later.');
        } else if (e.error.status >= 400) {
            this.displayError(
                'Invalid code',
                'Please check your code and try again.',
            );
        } else if (e.error.status === 0) {
            this.displayError(
                'Network error',
                'Check your connection and try again',
            );
        } else {
            this.displayError('An error occurred', 'Please try again later');
        }
    }

    private displayError(summary: string, detail: string): void {
        this.message.add({
            severity: 'error',
            summary,
            detail,
        });
    }
}
