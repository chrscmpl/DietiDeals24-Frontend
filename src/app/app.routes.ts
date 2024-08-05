import { Routes } from '@angular/router';
import { AuctionsSearchPageComponent } from './pages/auctions-search-page/auctions-search-page.component';

import { showUIFnGuard, hideUIFnGuard } from './guards/show-ui.guard';
import {
    authenticationFnGuard,
    dontAuthenticateFnGuard,
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
import { getAuctionResolverFn } from './resolvers/auction.resolver';
import {
    confirmReloadFnGuard,
    dontConfirmReloadFnGuard,
} from './guards/confirm-reload.guard';
import { TransactionsPageComponent } from './pages/transactions-page/transactions-page.component';
import { BiddingPageComponent } from './pages/transactions-page/bidding-page/bidding-page.component';
import { shouldSpecifyChildFnGuard } from './guards/should-specify-child.guard';
import { CheckoutPageComponent } from './pages/transactions-page/checkout-page/checkout-page.component';
import { TransactionOperation } from './enums/transaction-operation.enum';
import { getCheckoutInformationResolverFn } from './resolvers/checkout-information.resolver';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        title: 'DietiDeals24',
        canActivate: [showUIFnGuard, dontConfirmReloadFnGuard],
        component: HomePageComponent,
    },
    {
        path: 'auctions',
        title: 'Auctions',
        canActivate: [showUIFnGuard, dontConfirmReloadFnGuard],
        component: AuctionsSearchPageComponent,
    },
    {
        path: 'your-page',
        title: 'Your Page',
        component: YourPageComponent,
        canActivate: [
            showUIFnGuard,
            dontConfirmReloadFnGuard,
            authenticationFnGuard,
        ],
    },
    {
        path: 'create-auction',
        title: 'Create an Auction',
        component: CreateAuctionPageComponent,
        canActivate: [
            showUIFnGuard,
            dontConfirmReloadFnGuard,
            authenticationFnGuard,
        ],
    },
    {
        path: 'notifications',
        title: 'Notifications',
        component: NotificationsPageComponent,
        canActivate: [
            showUIFnGuard,
            dontConfirmReloadFnGuard,
            authenticationFnGuard,
        ],
    },
    {
        path: 'help',
        title: 'Frequently Asked Questions',
        component: HelpPageComponent,
        canActivate: [showUIFnGuard, dontConfirmReloadFnGuard],
    },
    {
        path: 'auth',
        title: 'Authentication',
        canActivate: [dontAuthenticateFnGuard],
        canActivateChild: [hideUIFnGuard, confirmReloadFnGuard],

        loadChildren: () =>
            import('./modules/auth-routing/auth-routing.module').then(
                (m) => m.AuthRoutingModule,
            ),
    },
    {
        path: 'auctions/:auction-id',
        outlet: 'overlay',
        component: AuctionDetailsPageComponent,
        resolve: { auction: getAuctionResolverFn() },
    },
    {
        path: 'auctions/:auction-id',
        redirectTo: '/home(overlay:auctions/:auction-id)',
    },
    {
        path: 'txn/:auction-id',
        component: TransactionsPageComponent,
        canActivate: [
            authenticationFnGuard,
            shouldSpecifyChildFnGuard,
            hideUIFnGuard,
            /*confirmReloadFnGuard*/
        ],
        children: [
            {
                path: TransactionOperation.bid,
                resolve: {
                    auction: getAuctionResolverFn({
                        ownAuction: false,
                        isAuctionActive: true,
                        useParent: true,
                    }),
                },
                children: [
                    {
                        path: '',
                        title: 'Bid',
                        component: BiddingPageComponent,
                    },
                    {
                        path: 'checkout',
                        title: 'Checkout',
                        resolve: {
                            checkoutInformation:
                                getCheckoutInformationResolverFn({
                                    useParent: true,
                                }),
                        },
                        component: CheckoutPageComponent,
                    },
                ],
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
