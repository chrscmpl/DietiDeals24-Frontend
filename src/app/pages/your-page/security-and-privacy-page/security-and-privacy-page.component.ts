import { Component, OnInit } from '@angular/core';
import { WindowService } from '../../../services/window.service';
import { MenuItem } from 'primeng/api';
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
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';

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
    public editPasswordForm!: FormGroup<EditPasswordForm>;
    public user!: AuthenticatedUser;
    public maskEmail = true;

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
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.termsOfServiceText = data['tos'];
            this.user = data['userData'];
        });

        this.initForm();
    }

    public editPassword(): void {
        if (this.editPasswordForm.invalid) {
            reactiveFormsUtils.markAllAsDirty(this.editPasswordForm);
            return;
        }
    }

    public showEditPasswordForm(): void {
        this.editPasswordForm.enable();
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
        this.editPasswordForm.disable();
    }

    public toggleEmailMask(): void {
        this.maskEmail = !this.maskEmail;
    }

    private validateConfirmPassword(
        control: AbstractControl<string>,
    ): ValidationErrors {
        if (control.value === this.editPasswordForm?.controls.newPassword.value)
            return {};
        return { passwordsDoNotMatch: true };
    }
}
