import { Routes } from '@angular/router';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page.component';
import { auctionsRequestGuard } from './guards/auctions-request.guard';
import { EmptyComponent } from './components/empty/empty.component';
import { hideUIGuard } from './guards/hide-ui.guard';
import { showUIGuard } from './guards/show-ui.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        title: 'Home',
        loadComponent: () =>
            import('./pages/home-page/home-page.component').then(
                (m) => m.HomePageComponent,
            ),
    },
    {
        path: 'auctions',
        component: SearchResultsPageComponent,
        resolve: { request: auctionsRequestGuard },
    },
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
        path: 'auth',
        title: 'Authentication',
        canActivate: [hideUIGuard],
        canDeactivate: [showUIGuard],

        loadComponent: () =>
            import(
                './pages/authentication-page/authentication-page.component'
            ).then((m) => m.AuthenticationPageComponent),

        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
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
        ],
    },
    {
        path: 'settings',
        title: 'Settings',
        outlet: 'overlay',
        loadComponent: () =>
            import('./pages/settings-popup/settings-popup.component').then(
                (m) => m.SettingsPopupComponent,
            ),
        children: [
            {
                path: '',
                redirectTo: 'theme',
                pathMatch: 'full',
            },
            {
                path: 'theme',
                loadComponent: () =>
                    import(
                        './pages/settings-popup/theme-settings/theme-settings.component'
                    ).then((m) => m.ThemeSettingsComponent),
            },
        ],
    },
    {
        path: 'redirect',
        component: EmptyComponent,
    },
    {
        path: '**',
        loadComponent: () =>
            import('./pages/not-found-page/not-found-page.component').then(
                (m) => m.NotFoundPageComponent,
            ),
    },
];
