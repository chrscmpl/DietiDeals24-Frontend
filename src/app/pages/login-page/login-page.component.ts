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
import { UserCredentials } from '../../models/user.model';

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
    loginForm = new FormGroup<any>({
        email: new FormControl<any>(null, [
            Validators.required,
            Validators.email,
        ]),
        password: new FormControl<any>(null, [
            Validators.required,
            Validators.minLength(8),
        ]),
    });

    dd24Login() {
        console.log(this.loginForm.value);
        // this.userService.login(this.loginForm.value);
    }

    googleLogin() {
        console.log('Google login');
    }
}
