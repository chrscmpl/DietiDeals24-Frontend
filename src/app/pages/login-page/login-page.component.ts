import { Component } from '@angular/core';
import { AuthenticationPageComponent } from '../authentication-page/authentication-page.component';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputComponent } from '../../components/inputs/input/input.component';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserCredentials } from '../../models/user.model';

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
export class LoginPageComponent {
    constructor(private userService: UserService) {}
    loginForm = new FormGroup<loginForm>({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
            Validators.required,
            Validators.minLength(8),
        ]),
    });

    dd24Login() {
        this.userService
            .login(this.loginForm.value as UserCredentials)
            .subscribe(() => {
                alert('Logged in?');
            });
    }

    googleLogin() {
        console.log('Google login');
    }
}
