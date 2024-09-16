import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CacheBustersService } from './services/cache-busters.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicator } from './helpers/loading-indicator';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { WindowService } from './services/window.service';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SmartStickyDirective } from './directives/smart-sticky.directive';
import { AuthenticationService } from './services/authentication.service';
import { NotificationsService } from './services/notifications.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { WarningsService } from './services/warnings.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NavigationService } from './services/navigation.service';

@Component({
    selector: 'dd24-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        AsyncPipe,
        HeaderComponent,
        FooterComponent,
        MobileNavbarComponent,
        MobileHeaderComponent,
        ButtonModule,
        SidebarComponent,
        SmartStickyDirective,
        ToastModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    private static readonly NOTIFICATION_REFRESH_INTERVAL = 1000 * 60;

    public readonly isLoadingRouteIndicator = new LoadingIndicator(100);

    constructor(
        public readonly windowService: WindowService,
        private readonly router: Router,
        private readonly primengConfig: PrimeNGConfig,
        private readonly authentication: AuthenticationService,
        private readonly notifications: NotificationsService,
        private readonly warnings: WarningsService,
        private readonly navigation: NavigationService,
        private readonly viewportScroller: ViewportScroller,
        _: CacheBustersService,
        __: ThemeService,
    ) {}

    public ngOnInit(): void {
        this.isLoadingRouteIndicator.start();
        this.redirectOnBadInitialRoute();
        this.configurePrimeNG();
        this.configureNotifications();

        this.navigation.navigationStart$.subscribe(() => {
            this.isLoadingRouteIndicator.start();
        });

        this.navigation.navigationStopped$.subscribe(() => {
            this.isLoadingRouteIndicator.stop();
        });
    }

    public ngAfterViewInit(): void {
        this.warnings.showInitialWarningIfFirstTimeLoaded();
    }

    public onMainRouterOutletActivate(): void {
        this.viewportScroller.scrollToPosition([0, 0]);
    }

    private redirectOnBadInitialRoute(): void {
        this.navigation.executeIfNavigationFailure(() =>
            this.router.navigate(['/home']),
        );
    }

    private configurePrimeNG(): void {
        this.primengConfig.ripple = true;
    }

    private configureNotifications(): void {
        let interval: ReturnType<typeof setInterval> | null = null;
        this.authentication.isLogged$.subscribe((isLogged) => {
            if (isLogged) {
                interval = setInterval(
                    this.notifications.refresh.bind(this.notifications),
                    AppComponent.NOTIFICATION_REFRESH_INTERVAL,
                );
            } else if (interval) {
                clearInterval(interval);
                interval = null;
            }
        });
    }
}
