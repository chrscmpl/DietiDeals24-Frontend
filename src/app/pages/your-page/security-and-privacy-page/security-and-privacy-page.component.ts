import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WindowService } from '../../../services/window.service';
import { MenuItem, MessageService } from 'primeng/api';
import { EditUserDataFormComponent } from '../../../components/edit-user-data-form/edit-user-data-form.component';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MaskedPipe } from '../../../pipes/masked.pipe';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { InputComponent } from '../../../components/input/input.component';
import { PasswordModule } from 'primeng/password';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils.helper';
import { AuthenticationService } from '../../../services/authentication.service';
import { ChangePasswordException } from '../../../exceptions/change-password.exception';
import { AccountProvider } from '../../../enums/account-provider.enum';

interface EditPasswordForm {
    oldPassword: FormControl<string | null>;
    newPassword: FormControl<string | null>;
    confirmNewPassword: FormControl<string | null>;
}

@Component({
    selector: 'dd24-security-and-privacy-page',
    standalone: true,
    imports: [
        EditUserDataFormComponent,
        InputTextModule,
        ButtonModule,
        MaskedPipe,
        IconFieldModule,
        InputIconModule,
        ReactiveFormsModule,
        InputComponent,
        PasswordModule,
    ],
    templateUrl: './security-and-privacy-page.component.html',
    styleUrl: './security-and-privacy-page.component.scss',
})
export class SecurityAndPrivacyPageComponent implements OnInit {
    @ViewChild('securityAndPrivacySection', { read: ElementRef })
    securityAndPrivacySection!: ElementRef;

    public editPasswordForm!: FormGroup<EditPasswordForm>;
    public disableEditPasswordForm = false;
    public user!: AuthenticatedUser;
    public maskEmail = true;
    public submissionLoading = false;

    public readonly environment = environment;

    public readonly tabs: MenuItem[] = [
        {
            label: 'Login & Security',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('sp-login-security'),
        },
        {
            label: 'TOS and Privacy Policy',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('sp-tos-pp'),
        },
    ];

    public termsOfServiceText?: string;

    public constructor(
        public readonly windowService: WindowService,
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly authenticationService: AuthenticationService,
        private readonly message: MessageService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.termsOfServiceText = data['tos'];
            this.user = data['userData'];
            if (this.user.provider !== AccountProvider.DD24)
                this.disableEditPasswordForm = true;
        });

        this.initForm();
    }

    public editPassword(): void {
        reactiveFormsUtils.forceValidation(
            this.editPasswordForm.controls.newPassword,
        );
        reactiveFormsUtils.forceValidation(
            this.editPasswordForm.controls.confirmNewPassword,
        );
        if (this.editPasswordForm.invalid) {
            reactiveFormsUtils.markAllAsDirty(this.editPasswordForm);
            return;
        }

        this.submissionLoading = true;
        this.authenticationService
            .changePassword({
                oldPassword: this.editPasswordForm.controls.oldPassword.value!,
                newPassword: this.editPasswordForm.controls.newPassword.value!,
            })
            .subscribe({
                next: this.onSubmissionSuccess.bind(this),
                error: this.onSubmissionError.bind(this),
            });
    }

    private onSubmissionSuccess(): void {
        this.submissionLoading = false;
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully',
        });
        this.hideEditPasswordForm();
    }

    private onSubmissionError(e: ChangePasswordException): void {
        this.submissionLoading = false;
        this.message.add({
            severity: 'error',
            summary: 'Error',
            detail:
                e.error?.status === 401
                    ? 'Your old password is incorrect'
                    : 'Failed to change password, try again later',
        });
    }

    public showEditPasswordForm(): void {
        this.editPasswordForm.enable();

        setTimeout(() => {
            const oldPasswordInput =
                this.securityAndPrivacySection.nativeElement.querySelector(
                    '#old-password',
                ) as HTMLInputElement | null;
            if (oldPasswordInput?.value) {
                this.editPasswordForm.controls.oldPassword.setValue(
                    oldPasswordInput.value,
                );
            }
        }, 500);
    }

    public hideEditPasswordForm(): void {
        this.editPasswordForm.disable();
        this.editPasswordForm.reset();
    }

    private initForm() {
        this.editPasswordForm = this.formBuilder.group({
            oldPassword: new FormControl<string | null>(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(environment.passwordPattern),
                ],
                updateOn: 'blur',
            }),
            newPassword: new FormControl<string | null>(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(environment.passwordPattern),
                    this.validateNewPassword.bind(this),
                ],
                updateOn: 'blur',
            }),
            confirmNewPassword: new FormControl<string | null>(null, {
                validators: [
                    Validators.required,
                    this.validateConfirmNewPassword.bind(this),
                ],
                updateOn: 'blur',
            }),
        });
        this.editPasswordForm.disable();
    }

    public toggleEmailMask(): void {
        this.maskEmail = !this.maskEmail;
    }

    private validateNewPassword(
        control: AbstractControl<string>,
    ): ValidationErrors {
        if (control.value === this.editPasswordForm?.controls.oldPassword.value)
            return { newPasswordSameAsOld: true };
        return {};
    }

    private validateConfirmNewPassword(
        control: AbstractControl<string>,
    ): ValidationErrors {
        if (control.value === this.editPasswordForm?.controls.newPassword.value)
            return {};
        return { passwordsDoNotMatch: true };
    }
}
