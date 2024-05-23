import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from '../../pages/login-page/login-page.component';
import { RegistrationPageComponent } from '../../pages/registration-page/registration-page.component';
import { ForgotPasswordPageComponent } from '../../pages/forgot-password-page/forgot-password-page.component';
import { AuthenticationPageComponent } from '../../pages/authentication-page/authentication-page.component';

const routes: Routes = [
    {
        path: '',
        component: AuthenticationPageComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                title: 'Login',
                component: LoginPageComponent,
            },
            {
                path: 'register',
                title: 'Sign Up',
                component: RegistrationPageComponent,
            },
            {
                path: 'forgot-password',
                title: 'Forgot Password',
                component: ForgotPasswordPageComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AuthRoutingModule {}