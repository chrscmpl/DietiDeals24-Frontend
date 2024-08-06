import { Routes } from '@angular/router';
import { AuctionsSearchPageComponent } from './pages/auctions-search-page/auctions-search-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { YourPageComponent } from './pages/your-page/your-page.component';
import { CreateAuctionPageComponent } from './pages/create-auction-page/create-auction-page.component';
import { SettingsPopupComponent } from './pages/settings-popup/settings-popup.component';
import { ThemeSettingsComponent } from './pages/settings-popup/theme-settings/theme-settings.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { AuctionDetailsPageComponent } from './pages/auction-details-page/auction-details-page.component';
import { TransactionsPageComponent } from './pages/transactions-page/transactions-page.component';
import { BiddingPageComponent } from './pages/transactions-page/bidding-page/bidding-page.component';
import { ShouldSpecifyChildGuard } from './guards/should-specify-child.guard';
import { CheckoutPageComponent } from './pages/transactions-page/checkout-page/checkout-page.component';
import { TransactionOperation } from './enums/transaction-operation.enum';
import { AuctionStatus } from './enums/auction-status.enum';
import { CheckoutInformationResolver } from './resolvers/checkout-information.resolver';
import { AuctionResolver } from './resolvers/auction.resolver';
import { ShowUIGuard } from './guards/show-ui.guard';
import { ConfirmReloadGuard } from './guards/confirm-reload.guard';
import { AuthenticationGuard } from './guards/authentication.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        title: 'DietiDeals24',
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
        ],
        component: HomePageComponent,
    },
    {
        path: 'auctions',
        title: 'Auctions',
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
        ],
        component: AuctionsSearchPageComponent,
    },
    {
        path: 'your-page',
        title: 'Your Page',
        component: YourPageComponent,
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
            AuthenticationGuard.asCanActivateFn(true),
        ],
    },
    {
        path: 'create-auction',
        title: 'Create an Auction',
        component: CreateAuctionPageComponent,
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
            AuthenticationGuard.asCanActivateFn(true),
        ],
    },
    {
        path: 'notifications',
        title: 'Notifications',
        component: NotificationsPageComponent,
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
            AuthenticationGuard.asCanActivateFn(true),
        ],
    },
    {
        path: 'help',
        title: 'Frequently Asked Questions',
        component: HelpPageComponent,
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
        ],
    },
    {
        path: 'auth',
        title: 'Authentication',
        canActivate: [
            AuthenticationGuard.asCanActivateFn(false),
            ShowUIGuard.asCanActivateFn(false),
            ConfirmReloadGuard.asCanActivateFn(true),
        ],

        loadChildren: () =>
            import('./modules/auth-routing/auth-routing.module').then(
                (m) => m.AuthRoutingModule,
            ),
    },
    {
        path: 'auctions/:auction-id',
        outlet: 'overlay',
        component: AuctionDetailsPageComponent,
        resolve: { auction: AuctionResolver.asResolveFn() },
    },
    {
        path: 'auctions/:auction-id',
        redirectTo: '/home(overlay:auctions/:auction-id)',
    },
    {
        path: 'txn/:auction-id',
        component: TransactionsPageComponent,
        canActivate: [
            AuthenticationGuard.asCanActivateFn(true),
            ShouldSpecifyChildGuard.asCanActivateFn(),
            ShowUIGuard.asCanActivateFn(false),
            // ConfirmReloadGuard.asCanActivateFn(true),
        ],
        children: [
            {
                path: TransactionOperation.bid,
                resolve: {
                    auction: AuctionResolver.asResolveFn({
                        ownAuction: false,
                        requiredStatus: AuctionStatus.active,
                        hasAlreadyBidded: false,
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
                                CheckoutInformationResolver.asResolveFn({
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
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
        ],
        component: NotFoundPageComponent,
    },
];
