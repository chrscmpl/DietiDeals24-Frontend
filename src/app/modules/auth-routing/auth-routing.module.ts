import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from '../../pages/authentication-page/login-page/login-page.component';
import { RegistrationPageComponent } from '../../pages/authentication-page/registration-page/registration-page.component';
import { ForgotPasswordPageComponent } from '../../pages/authentication-page/forgot-password-page/forgot-password-page.component';
import { AuthenticationPageComponent } from '../../pages/authentication-page/authentication-page.component';
import { VerifyEmailPageComponent } from '../../pages/authentication-page/verify-email-page/verify-email-page.component';
import { EmailVerificationGuard } from '../../guards/email-verification.guard';

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
            {
                path: 'verify-email',
                title: 'Verify Email',
                component: VerifyEmailPageComponent,
                canActivate: [EmailVerificationGuard.asCanActivateFn()],
                canDeactivate: [EmailVerificationGuard.asCanDeactivateFn()],
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AuthRoutingModule {}
