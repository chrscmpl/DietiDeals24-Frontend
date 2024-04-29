import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthenticationPageComponent } from './pages/authentication-page/authentication-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { YourPageComponent } from './pages/your-page/your-page.component';
import { CreateAuctionPageComponent } from './pages/create-auction-page/create-auction-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent },
    { path: 'your-page', component: YourPageComponent },
    { path: 'create-auction', component: CreateAuctionPageComponent },
    { path: 'help', component: HelpPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegistrationPageComponent },
    { path: 'forgot-password', component: ForgotPasswordPageComponent },
    { path: 'auth', component: AuthenticationPageComponent },
];
