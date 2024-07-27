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
import { MaskedPipe } from '../../../pipes/masked.pipe';
import { emailVerificationDTO } from '../../../DTOs/user.dto';
import { RedirectionService } from '../../../services/redirection.service';
import { HttpErrorResponse } from '@angular/common/http';

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
            code: new FormControl('', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(5),
            ]),
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

        this.error = null;

        this.authentication.verifyEmail(
            this.verificationForm.value as emailVerificationDTO,
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
        this.verificationForm.markAllAsTouched();
    }

    private onVerificationSuccess(): void {
        this.redirect.exitRoute();
    }

    private onVerificationError(err: HttpErrorResponse): void {
        if (err.status >= 500) {
            this.error =
                'There was an error with the server. Please try again later.';
        } else if (err.status >= 401) {
            this.error = 'Invalid code';
        }
    }
}
