import { Routes } from '@angular/router';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page.component';
import { SettingsPopupComponent } from './pages/settings-popup/settings-popup.component';
import { ThemeSettingsComponent } from './pages/settings-popup/theme-settings/theme-settings.component';

const mainRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: 'home',
        title: 'Home',
        loadComponent: () =>
            import('./pages/home-page/home-page.component').then(
                (m) => m.HomePageComponent,
            ),
    },
    { path: 'search/:category', component: SearchResultsPageComponent },
    {
        path: 'your-page',
        title: 'Your Page',
        loadComponent: () =>
            import('./pages/your-page/your-page.component').then(
                (m) => m.YourPageComponent,
            ),
    },
    {
        path: 'create-auction',
        title: 'Create an Auction',
        loadComponent: () =>
            import(
                './pages/create-auction-page/create-auction-page.component'
            ).then((m) => m.CreateAuctionPageComponent),
    },
    {
        path: 'help',
        title: 'Frequently Asked Questions',
        loadComponent: () =>
            import('./pages/help-page/help-page.component').then(
                (m) => m.HelpPageComponent,
            ),
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
            import('./pages/login-page/login-page.component').then(
                (m) => m.LoginPageComponent,
            ),
    },
    {
        path: 'register',
        title: 'Sign Up',
        loadComponent: () =>
            import(
                './pages/registration-page/registration-page.component'
            ).then((m) => m.RegistrationPageComponent),
    },
    {
        path: 'forgot-password',
        title: 'Forgot Password',
        loadComponent: () =>
            import(
                './pages/forgot-password-page/forgot-password-page.component'
            ).then((m) => m.ForgotPasswordPageComponent),
    },
];

const popupRoutes: Routes = [
    {
        path: 'settings',
        title: 'Settings',
        outlet: 'overlay',
        component: SettingsPopupComponent,
        children: [
            {
                path: '',
                redirectTo: 'theme',
                pathMatch: 'full',
            },
            {
                path: 'theme',
                component: ThemeSettingsComponent,
            },
        ],
    },
];

export const routes = [
    ...mainRoutes,
    ...popupRoutes,
    {
        path: '**',
        loadComponent: () =>
            import('./pages/not-found-page/not-found-page.component').then(
                (m) => m.NotFoundPageComponent,
            ),
    },
];
