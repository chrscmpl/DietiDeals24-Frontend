import { Routes } from '@angular/router';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home-page/home-page.component').then(
                (m) => m.HomePageComponent,
            ),
    },
    { path: 'search/:category', component: SearchResultsPageComponent },
    {
        path: 'your-page',
        loadComponent: () =>
            import('./pages/your-page/your-page.component').then(
                (m) => m.YourPageComponent,
            ),
    },
    {
        path: 'create-auction',
        loadComponent: () =>
            import(
                './pages/create-auction-page/create-auction-page.component'
            ).then((m) => m.CreateAuctionPageComponent),
    },
    {
        path: 'help',
        loadComponent: () =>
            import('./pages/help-page/help-page.component').then(
                (m) => m.HelpPageComponent,
            ),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login-page/login-page.component').then(
                (m) => m.LoginPageComponent,
            ),
    },
    {
        path: 'register',
        loadComponent: () =>
            import(
                './pages/registration-page/registration-page.component'
            ).then((m) => m.RegistrationPageComponent),
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
            import(
                './pages/forgot-password-page/forgot-password-page.component'
            ).then((m) => m.ForgotPasswordPageComponent),
    },
];
