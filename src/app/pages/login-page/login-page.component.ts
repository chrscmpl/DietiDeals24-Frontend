import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationPageComponent } from '../authentication-page/authentication-page.component';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputComponent } from '../../components/inputs/input/input.component';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserCredentials } from '../../models/user.model';
import { Location } from '@angular/common';

interface loginForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

@Component({
    selector: 'dd24-login-page',
    standalone: true,
    imports: [
        AuthenticationPageComponent,
        ReactiveFormsModule,
        InputComponent,
        RouterLink,
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
    error: string = '';
    loginForm!: FormGroup<loginForm>;
    formError: boolean = false;

    constructor(
        private userService: UserService,
        private location: Location,
        private formBuilder: FormBuilder,
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
            this.formError = true;
            return;
        }
        this.formError = false;
        this.userService
            .login(this.loginForm.value as UserCredentials)
            .subscribe({
                next: () => {
                    this.location.back();
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
            });
    }

    googleLogin() {}

    clearError() {
        this.error = '';
    }
}
