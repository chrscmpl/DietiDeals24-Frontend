import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicator } from './helpers/loadingIndicator';
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
    private static readonly INITIAL_WARNING_COUNTER = 5;
    private static readonly INITIAL_WARNING_ITEM_NAME = 'warn-again-counter';

    public readonly isLoadingRouteIndicator = new LoadingIndicator(100);

    constructor(
        public readonly windowService: WindowService,
        private readonly primengConfig: PrimeNGConfig,
        private readonly themeService: ThemeService,
        private readonly authentication: AuthenticationService,
        private readonly notifications: NotificationsService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.isLoadingRouteIndicator.start();
        this.configurePrimeNG();
        this.themeService.initTheme();
        if (localStorage.getItem('authorizationToken')) {
            this.authentication.getUserData();
        }
        this.configureNotifications();
    }

    ngAfterViewInit(): void {
        this.updateInitialWarningStatus();
    }

    public onMainRouterOutletActivate(): void {
        this.isLoadingRouteIndicator.stop();
    }

    public onMainRouterOutletDeactivate(): void {
        this.isLoadingRouteIndicator.start();
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

    private updateInitialWarningStatus(): void {
        const timesWarned: number = Number(
            localStorage.getItem(AppComponent.INITIAL_WARNING_ITEM_NAME) ?? 0,
        );

        if (timesWarned > 0) {
            localStorage.setItem(
                AppComponent.INITIAL_WARNING_ITEM_NAME,
                String(timesWarned - 1),
            );
            return;
        }

        this.showInitialWarning();

        localStorage.setItem(
            AppComponent.INITIAL_WARNING_ITEM_NAME,
            String(AppComponent.INITIAL_WARNING_COUNTER - 1),
        );
    }

    private showInitialWarning(): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'This is not a real e-commerce platform',
            detail: 'This is a student project, not a real platform. Please do not use real data. Any transaction you make will not be real.',
            life: 10 * 60 * 1000,
        });
    }
}
