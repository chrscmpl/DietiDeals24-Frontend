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
import { AuctionConclusionPageComponent } from './pages/transactions-page/auction-conclusion-page/auction-conclusion-page.component';
import { FAQResolver } from './resolvers/faq.resolver';
import { RulesetDescriptionResolver } from './resolvers/ruleset-description.resolver';
import { CurrencyCodesResolver } from './resolvers/currency-codes.resolver';
import { AuctionPreviewResolver } from './resolvers/auction-preview.resolver';
import { ActivityPageComponent } from './pages/your-page/activity-page/activity-page.component';
import { YourDataPageComponent } from './pages/your-page/your-data-page/your-data-page.component';
import { SecurityAndPrivacyPageComponent } from './pages/your-page/security-and-privacy-page/security-and-privacy-page.component';
import { UserAuctionListComponent } from './components/user-auction-list/user-auction-list.component';
import { AuctionsRequestDataResolver } from './resolvers/auctions-request-params.resolver';
import { AuthenticatedUserDataResolver } from './resolvers/authenticated-user-data.resolver';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserResolver } from './resolvers/user.resolver';
import { RedirectToPersonalPageGuard } from './guards/redirect-to-personal-page.guard';
import { TextAssetResolver } from './resolvers/text-asset.resolver';
import { PaymentMethodsResolver } from './resolvers/payment-methods.resolver';
import { CountriesResolver } from './resolvers/countries.resolver';
import { MessagePageComponent } from './pages/message-page/message-page.component';

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
            AuthenticationGuard.asCanActivateFn(true),
        ],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'activity',
            },
            {
                path: 'activity',
                component: ActivityPageComponent,
                canActivate: [ConfirmReloadGuard.asCanActivateFn(false)],
                resolve: {
                    userData: AuthenticatedUserDataResolver.asResolveFn(),
                },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'current',
                    },
                    {
                        path: 'current',
                        component: UserAuctionListComponent,
                        resolve: {
                            auctionsRequestData:
                                AuctionsRequestDataResolver.asResolveFn(
                                    '/activity/current',
                                    {
                                        pageSize: 10,
                                        ownAuctions: true,
                                        currentAuctions: true,
                                    },
                                ),
                        },
                    },
                    {
                        path: 'past',
                        component: UserAuctionListComponent,
                        resolve: {
                            auctionsRequestData:
                                AuctionsRequestDataResolver.asResolveFn(
                                    '/activity/past',
                                    {
                                        pageSize: 10,
                                        ownAuctions: true,
                                        currentAuctions: false,
                                    },
                                ),
                        },
                    },
                ],
            },
            {
                path: 'your-data',
                title: 'Your Data',
                component: YourDataPageComponent,
                canActivate: [ConfirmReloadGuard.asCanActivateFn(true)],
                resolve: {
                    paymentMethods: PaymentMethodsResolver.asResolveFn(),
                    userData: AuthenticatedUserDataResolver.asResolveFn(),
                    countries: CountriesResolver.asResolveFn(),
                },
            },
            {
                path: 'security-privacy',
                title: 'Security & Privacy',
                component: SecurityAndPrivacyPageComponent,
                canActivate: [ConfirmReloadGuard.asCanActivateFn(true)],
                resolve: {
                    tos: TextAssetResolver.asResolveFn('tos.txt'),
                    userData: AuthenticatedUserDataResolver.asResolveFn(),
                },
            },
        ],
    },
    {
        path: 'create-auction',
        title: 'Create an Auction',
        component: CreateAuctionPageComponent,
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(true),
            AuthenticationGuard.asCanActivateFn(true),
        ],
        resolve: {
            rulesets: RulesetDescriptionResolver.asResolveFn(),
            currencyCodes: CurrencyCodesResolver.asResolveFn(),
        },
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
        path: 'users/:user-id',
        component: UserPageComponent,
        title: 'Users',
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
            RedirectToPersonalPageGuard.asCanActivateFn(),
        ],
        resolve: {
            user: UserResolver.asResolveFn(),
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'current-activity',
            },
            {
                path: 'current-activity',
                component: UserAuctionListComponent,
                resolve: {
                    auctionsRequestData:
                        AuctionsRequestDataResolver.asResolveFn(
                            '/user/current',
                            {
                                pageSize: 10,
                                currentAuctions: true,
                            },
                            {
                                useParent: true,
                                userParam: 'user-id',
                            },
                        ),
                },
            },
            {
                path: 'past-activity',
                component: UserAuctionListComponent,
                resolve: {
                    auctionsRequestData:
                        AuctionsRequestDataResolver.asResolveFn(
                            '/user/past',
                            {
                                pageSize: 10,
                                currentAuctions: false,
                            },
                            {
                                useParent: true,
                                userParam: 'user-id',
                            },
                        ),
                },
            },
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
        resolve: { faq: FAQResolver.asResolveFn() },
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
            import('./modules/authentication.module').then(
                (m) => m.AuthenticationModule,
            ),
    },
    {
        path: 'reset-password/:id/:token',
        redirectTo: 'auth/reset-password/:id/:token',
        pathMatch: 'full',
    },
    {
        path: 'auctions/:auction-id',
        outlet: 'overlay',
        component: AuctionDetailsPageComponent,
        resolve: {
            auction: AuctionResolver.asResolveFn({
                includeUser: true,
                includeWinnerIfPresent: true,
            }),
        },
    },
    {
        path: 'auctions/:auction-id',
        redirectTo: '/home(overlay:auctions/:auction-id)',
    },
    {
        path: 'auction-preview',
        outlet: 'overlay',
        component: AuctionDetailsPageComponent,
        resolve: {
            auction: AuctionPreviewResolver.asResolveFn(),
        },
    },
    {
        path: 'message/:auction-id',
        title: 'Message',
        component: MessagePageComponent,
        canActivate: [
            ShowUIGuard.asCanActivateFn(true),
            ConfirmReloadGuard.asCanActivateFn(false),
            AuthenticationGuard.asCanActivateFn(true),
        ],
        resolve: {
            auction: AuctionResolver.asResolveFn({
                isWinnerOrOwner: true,
                requiredStatus: AuctionStatus.accepted,
                includeUser: true,
                includeWinner: true,
            }),
        },
    },
    {
        path: 'txn/:auction-id',
        component: TransactionsPageComponent,
        canActivate: [
            AuthenticationGuard.asCanActivateFn(true),
            ShouldSpecifyChildGuard.asCanActivateFn(),
            ShowUIGuard.asCanActivateFn(false),
            ConfirmReloadGuard.asCanActivateFn(true),
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
            {
                path: TransactionOperation.conclude,
                resolve: {
                    auction: AuctionResolver.asResolveFn({
                        ownAuction: true,
                        requiredStatus: AuctionStatus.pending,
                        useParent: true,
                        includeWinner: true,
                    }),
                },
                children: [
                    {
                        path: '',
                        title: 'Auction conclusion',
                        component: AuctionConclusionPageComponent,
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
