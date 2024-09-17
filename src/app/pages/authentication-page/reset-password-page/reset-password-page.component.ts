import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { take } from 'rxjs';
import { InputComponent } from '../../../components/input/input.component';
import { environment } from '../../../../environments/environment';
import { PasswordModule } from 'primeng/password';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';
import { AuthenticationService } from '../../../services/authentication.service';
import { ResetForgottenPasswordException } from '../../../exceptions/reset-forgotten-password.exception';
import { MessageService } from 'primeng/api';

interface ResetPasswordForm {
    newPassword: FormControl<string | null>;
    confirmNewPassword: FormControl<string | null>;
}

@Component({
    selector: 'dd24-reset-password-page',
    standalone: true,
    imports: [
        ButtonModule,
        ReactiveFormsModule,
        InputComponent,
        PasswordModule,
    ],
    templateUrl: './reset-password-page.component.html',
    styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent implements OnInit {
    private id!: string;
    private token!: string;
    public resetPasswordForm!: FormGroup<ResetPasswordForm>;
    public resettedSuccessfully: boolean = false;
    public submissionLoading: boolean = false;

    public readonly environment = environment;

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly authentication: AuthenticationService,
        private readonly message: MessageService,
    ) {}

    public ngOnInit(): void {
        this.route.params.pipe(take(1)).subscribe((params) => {
            this.id = params['id'];
            this.token = params['token'];
        });

        this.resetPasswordForm = this.formBuilder.group<ResetPasswordForm>({
            newPassword: new FormControl<string | null>(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(environment.passwordPattern),
                ],
                updateOn: 'blur',
            }),
            confirmNewPassword: new FormControl<string | null>(null, {
                validators: [
                    Validators.required,
                    this.validateConfirmPassword.bind(this),
                ],
                updateOn: 'blur',
            }),
        });
    }

    public onSubmit(): void {
        reactiveFormsUtils.forceValidation(
            this.resetPasswordForm.controls.confirmNewPassword,
        );
        if (this.resetPasswordForm.invalid) {
            reactiveFormsUtils.markAllAsDirty(this.resetPasswordForm);
            return;
        }

        this.submissionLoading = true;
        this.authentication
            .resetForgottenPassword({
                userId: this.id,
                token: this.token,
                newPassword: this.resetPasswordForm.value.newPassword!,
            })
            .subscribe({
                next: this.onSubmissionSuccess.bind(this),
                error: this.onSubmissionError.bind(this),
            });
    }

    private onSubmissionSuccess(): void {
        this.submissionLoading = false;
        this.resettedSuccessfully = true;
    }

    private onSubmissionError(e: ResetForgottenPasswordException): void {
        this.submissionLoading = false;
        if (e.error.status >= 500) {
            this.displayError('Server error', 'Please try again later');
        } else if (e.error.status >= 400) {
            this.displayError(
                'Invalid submission',
                'Paste the url you received and try again',
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

    private validateConfirmPassword(
        control: AbstractControl<string>,
    ): ValidationErrors {
        if (
            control.value === this.resetPasswordForm?.controls.newPassword.value
        )
            return {};
        return { passwordsDoNotMatch: true };
    }
}
