import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicator } from './helpers/loading-indicator';
import { AsyncPipe } from '@angular/common';
import { WindowService } from './services/window.service';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { SmartStickyDirective } from './directives/smart-sticky.directive';
import { AuthenticationService } from './services/authentication.service';
import { NotificationsService } from './services/notifications.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { filter, take } from 'rxjs';
import { WarningsService } from './services/warnings.service';

@Component({
    selector: 'dd24-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        LoadingPlaceholderComponent,
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
        private readonly themeService: ThemeService,
        private readonly authentication: AuthenticationService,
        private readonly notifications: NotificationsService,
        private readonly warnings: WarningsService,
    ) {}

    public ngOnInit(): void {
        this.isLoadingRouteIndicator.start();
        this.configureLayout();
        this.redirectOnBadInitialRoute();
        this.configurePrimeNG();
        this.themeService.initTheme();
        this.configureNotifications();
    }

    public ngAfterViewInit(): void {
        this.warnings.showInitialWarningIfFirstTimeLoaded();
    }

    public onMainRouterOutletActivate(): void {
        this.isLoadingRouteIndicator.stop();
    }

    public onMainRouterOutletDeactivate(): void {
        this.isLoadingRouteIndicator.start();
    }

    private configureLayout(): void {
        try {
            const navigator: any = window.navigator; // eslint-disable-line @typescript-eslint/no-explicit-any
            navigator.virtualKeyboard.overlaysContent = true;
        } catch {
            console.warn('Browser does not support VirtualKeyboard API');
        }
    }

    private redirectOnBadInitialRoute(): void {
        this.router.events
            .pipe(
                filter(
                    (e) =>
                        e instanceof NavigationEnd ||
                        e instanceof NavigationCancel ||
                        e instanceof NavigationError,
                ),
                take(1),
            )
            .subscribe((e) => {
                if (!(e instanceof NavigationEnd)) {
                    this.windowService.setUIvisibility(true);
                    this.router.navigate(['/home']);
                }
            });
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
            }
        });
    }
}
