import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputComponent } from '../../../components/input/input.component';
import { DividerModule } from 'primeng/divider';
import { RedirectionService } from '../../../services/redirection.service';
import { UserCredentials } from '../../../DTOs/user.dto';
import { environment } from '../../../../environments/environment';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';

interface loginForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

@Component({
    selector: 'dd24-login-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        InputComponent,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        DividerModule,
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit, AfterViewInit {
    error: string = '';
    loginForm!: FormGroup<loginForm>;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly redirect: RedirectionService,
        private readonly formBuilder: FormBuilder,
        private readonly element: ElementRef,
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group<loginForm>({
            email: new FormControl(null, {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur',
            }),
            password: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(environment.passwordPattern),
                ],
                updateOn: 'blur',
            }),
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.patchValueFromNativeElement('email', '#email');
            this.patchValueFromNativeElement('password', '#password');
        }, 150);
    }

    private patchValueFromNativeElement(
        controlName: string,
        querySelector: string,
    ): void {
        const nativeInput = this.element.nativeElement.querySelector(
            querySelector,
        ) as HTMLInputElement | null;

        if (nativeInput?.value)
            this.loginForm.get(controlName)?.patchValue(nativeInput.value);
    }

    dd24Login() {
        if (this.loginForm.invalid) {
            reactiveFormsUtils.markAllAsDirty(this.loginForm);
            return;
        }
        this.authenticationService.login(
            this.loginForm.value as UserCredentials,
            {
                next: () => {
                    this.redirect.exitRoute();
                },
                error: (err) => {
                    if (err.status === 401) {
                        this.error = 'Incorrect email or password';
                    } else if (err.status >= 500) {
                        this.error =
                            "Couldn't reach the server, please try again later";
                    } else if (err.status >= 400) {
                        this.error = 'Invalid credentials';
                    } else {
                        this.error = 'An error occurred';
                    }
                },
            },
        );
    }

    googleLogin() {}

    clearError() {
        this.error = '';
    }
}
