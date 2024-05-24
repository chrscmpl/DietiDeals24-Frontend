import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserCredentials } from '../../../models/user.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputComponent } from '../../../components/input/input.component';
import { DividerModule } from 'primeng/divider';
import { RedirectionService } from '../../../services/redirection.service';

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
export class LoginPageComponent implements OnInit {
    error: string = '';
    loginForm!: FormGroup<loginForm>;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly redirect: RedirectionService,
        private readonly formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group<loginForm>({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/),
            ]),
        });
    }

    dd24Login() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
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
