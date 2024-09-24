import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../../components/input/input.component';
import { ButtonModule } from 'primeng/button';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils.helper';
import { AuthenticationService } from '../../../services/authentication.service';
import { MessageService } from 'primeng/api';
import { RequestForgottenPasswordResetException } from '../../../exceptions/request-forgotten-password-reset.exception';
import { RouterLink } from '@angular/router';

interface ForgotPasswordForm {
    emailOrUsername: FormControl<string | null>;
}

@Component({
    selector: 'dd24-forgot-password-page',
    standalone: true,
    imports: [
        InputComponent,
        ButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        RouterLink,
    ],
    templateUrl: './forgot-password-page.component.html',
    styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent implements OnInit {
    public forgotPasswordForm!: FormGroup<ForgotPasswordForm>;
    public submissionLoading: boolean = false;
    public submittedSuccessfully: boolean = false;

    public constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authentication: AuthenticationService,
        private readonly message: MessageService,
    ) {}

    public ngOnInit(): void {
        this.forgotPasswordForm = this.formBuilder.group({
            emailOrUsername: new FormControl<string | null>(null, {
                updateOn: 'blur',
                validators: [Validators.required],
            }),
        });
    }

    public onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
            reactiveFormsUtils.markAllAsDirty(this.forgotPasswordForm);
            return;
        }

        this.submissionLoading = true;
        this.authentication
            .requestForgottenPasswordReset(
                this.forgotPasswordForm.value.emailOrUsername!.includes('@')
                    ? { email: this.forgotPasswordForm.value.emailOrUsername! }
                    : {
                          username:
                              this.forgotPasswordForm.value.emailOrUsername!,
                      },
            )
            .subscribe({
                next: this.onSubmissionSuccess.bind(this),
                error: this.onSubmissionError.bind(this),
            });
    }

    private onSubmissionSuccess(): void {
        this.submissionLoading = false;
        this.submittedSuccessfully = true;
    }

    private onSubmissionError(e: RequestForgottenPasswordResetException): void {
        this.submissionLoading = false;
        if (e.error.status >= 500) {
            this.displayError('Server error', 'Please try again later');
        } else if (e.error.status >= 400) {
            this.displayError(
                'Incorrect email or username',
                'Please try again',
            );
        } else if (e.error.status === 0) {
            this.displayError(
                'Network error',
                'Check your connection and try again',
            );
        } else {
            this.displayError('An error occurred', 'Please try again');
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
