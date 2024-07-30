import { Routes } from '@angular/router';
import { AuctionsSearchPageComponent } from './pages/auctions-search-page/auctions-search-page.component';
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
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { AuctionDetailsPageComponent } from './pages/auction-details-page/auction-details-page.component';
import { resolveAuctionGuard } from './guards/resolve-auction.guard';
import {
    confirmReloadActivateGuard,
    confirmReloadDeactivateGuard,
} from './guards/confirm-reload.guard';
import { TransactionsPageComponent } from './pages/transactions-page/transactions-page.component';
import { BiddingPageComponent } from './pages/transactions-page/bidding-page/bidding-page.component';
import { shouldSpecifyChildGuard } from './guards/should-specify-child.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        title: 'DietiDeals24',
        component: HomePageComponent,
    },
    {
        path: 'auctions',
        title: 'Auctions',
        component: AuctionsSearchPageComponent,
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
        path: 'notifications',
        title: 'Notifications',
        component: NotificationsPageComponent,
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
        canActivate: [
            notAUthenticatedGuard,
            hideUIGuard,
            confirmReloadActivateGuard,
        ],
        canDeactivate: [showUIGuard, confirmReloadDeactivateGuard],
        loadChildren: () =>
            import('./modules/auth-routing/auth-routing.module').then(
                (m) => m.AuthRoutingModule,
            ),
    },
    {
        path: 'auction/:auction-id',
        outlet: 'overlay',
        component: AuctionDetailsPageComponent,
        resolve: { auction: resolveAuctionGuard },
    },
    {
        path: 'txn/:auction-id',
        component: TransactionsPageComponent,
        canActivate: [
            authenticationGuard,
            shouldSpecifyChildGuard,
            hideUIGuard,
            /*confirmReloadActivateGuard*/
        ],
        resolve: { auction: resolveAuctionGuard },
        canDeactivate: [showUIGuard /*confirmReloadDeactivateGuard*/],
        children: [
            {
                path: 'bid',
                component: BiddingPageComponent,
                title: 'Bid',
            },
        ],
    },
    {
        path: 'settings',
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
        path: '**',
        component: NotFoundPageComponent,
    },
];
