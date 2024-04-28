import { Component } from '@angular/core';
import { AuthenticationPageComponent } from '../authentication-page/authentication-page.component';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'dd24-login-page',
    standalone: true,
    imports: [AuthenticationPageComponent, ReactiveFormsModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
})
export class LoginPageComponent extends AuthenticationPageComponent {
    loginForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
            Validators.required,
            Validators.minLength(8),
        ]),
    });

    dd24Login() {
        console.log('Login form values:', this.loginForm);
    }

    googleLogin() {
        console.log('Google login');
    }
}