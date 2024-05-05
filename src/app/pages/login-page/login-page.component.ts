import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { AuthenticationService } from '../../services/authentication.service';
import { UserCredentials } from '../../models/user.model';
import { Location } from '@angular/common';
import { ReplaySubject, Subject, shareReplay, startWith } from 'rxjs';

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
export class LoginPageComponent implements OnInit, OnDestroy {
    error: string = '';
    loginForm!: FormGroup<loginForm>;
    formErrorSubject: Subject<boolean> = new ReplaySubject<boolean>(1);
    formError$ = this.formErrorSubject.asObservable();

    constructor(
        private authenticationService: AuthenticationService,
        private location: Location,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.formErrorSubject.next(false);
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

    ngOnDestroy(): void {
        this.formErrorSubject.complete();
    }

    dd24Login() {
        if (this.loginForm.invalid) {
            this.formErrorSubject.next(true);
            return;
        }
        this.formErrorSubject.next(false);
        this.authenticationService.login(
            this.loginForm.value as UserCredentials,
            {
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
            },
        );
    }

    googleLogin() {}

    clearError() {
        this.error = '';
    }
}
