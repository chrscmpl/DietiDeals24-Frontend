import { Routes } from '@angular/router';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page.component';
import { auctionsRequestGuard } from './guards/auctions-request.guard';
import { EmptyComponent } from './components/empty/empty.component';
import { hideUIGuard } from './guards/hide-ui.guard';
import { showUIGuard } from './guards/show-ui.guard';
import {
    authenticationGuard,
    notAUthenticatedGuard,
} from './guards/authentication.guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { YourPageComponent } from './pages/your-page/your-page.component';
import { CreateAuctionPageComponent } from './pages/create-auction-page/create-auction-page.component';
import { SettingsPopupComponent } from './pages/settings-popup/settings-popup.component';
import { ThemeSettingsComponent } from './pages/settings-popup/theme-settings/theme-settings.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        title: 'Home',
        component: HomePageComponent,
    },
    {
        path: 'auctions',
        component: SearchResultsPageComponent,
        resolve: { request: auctionsRequestGuard },
    },
    {
        path: 'your-page',
        title: 'Your Page',
        component: YourPageComponent,
        canActivate: [authenticationGuard],
    },
    {
        path: 'create-auction',
        title: 'Create an Auction',
        component: CreateAuctionPageComponent,
        canActivate: [authenticationGuard],
    },
    {
        path: 'help',
        title: 'Frequently Asked Questions',
        component: HelpPageComponent,
    },
    {
        path: 'auth',
        title: 'Authentication',
        canActivate: [notAUthenticatedGuard, hideUIGuard],
        canDeactivate: [showUIGuard],
        loadChildren: () =>
            import('./modules/auth-routing/auth-routing.module').then(
                (m) => m.AuthRoutingModule,
            ),
    },
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
    {
        path: 'redirect',
        component: EmptyComponent,
    },
    {
        path: '**',
        component: NotFoundPageComponent,
    },
];
