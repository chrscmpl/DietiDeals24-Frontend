import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Location } from '@angular/common';
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
import { MaskedEmailPipe } from '../../../pipes/masked-email.pipe';
import { emailVerificationDTO } from '../../../DTOs/user.dto';
import { RedirectionService } from '../../../services/redirection.service';

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
        MaskedEmailPipe,
    ],
    templateUrl: './verify-email-page.component.html',
    styleUrl: './verify-email-page.component.scss',
})
export class VerifyEmailPageComponent implements OnInit {
    public verificationForm!: FormGroup<verificationForm>;
    public showEmail: boolean = false;
    public error: string | null = null;

    public constructor(
        private readonly location: Location,
        private readonly authentication: AuthenticationService,
        private readonly formBuilder: FormBuilder,
        private readonly redirect: RedirectionService,
    ) {}

    public ngOnInit(): void {
        if (!this.authentication.emailToVerify) {
            this.location.back();
            return;
        }
        this.verificationForm = this.formBuilder.group<verificationForm>({
            code: new FormControl(null, [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(5),
            ]),
            email: new FormControl(
                { value: this.authentication.emailToVerify, disabled: true },
                [Validators.required],
            ),
        });
    }

    toggleEmailVisibility() {
        this.showEmail = !this.showEmail;
    }

    public onSubmit(): void {
        if (this.verificationForm.invalid) {
            this.onSubmitError();
            return;
        }
        this.error = null;
        this.authentication.verifyEmail(
            this.verificationForm.value as emailVerificationDTO,
            {
                next: () => {
                    this.redirect.exitRoute();
                },
                error: () => {
                    this.error = 'Invalid code';
                },
            },
        );
    }

    public onSubmitError(): void {
        this.verificationForm.markAllAsTouched();
    }

    public onKeyPressed(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onSubmit();
        }
    }
}
