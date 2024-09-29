import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CacheBustersService } from './services/cache-busters.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicator } from './helpers/loading-indicator.helper';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { WindowService } from './services/window.service';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { MessageService } from 'primeng/api';
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
import { fromEvent, Subscription } from 'rxjs';
import { IntervalService } from './services/interval.service';

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
    public readonly isLoadingRouteIndicator = new LoadingIndicator(500);
    private suppressContextMenuSubscription: Subscription | null = null;
    public mobileToastHideTransformOptions = 'translateX(100%)';

    constructor(
        public readonly windowService: WindowService,
        private readonly router: Router,
        private readonly authentication: AuthenticationService,
        private readonly notifications: NotificationsService,
        private readonly message: MessageService,
        private readonly warnings: WarningsService,
        private readonly navigation: NavigationService,
        private readonly viewportScroller: ViewportScroller,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly timer: IntervalService,
        _: CacheBustersService,
        __: ThemeService,
    ) {}

    public ngOnInit(): void {
        this.isLoadingRouteIndicator.start();
        this.redirectOnBadInitialRoute();
        this.configureNotificationsPolling();

        this.navigation.navigationStart$.subscribe(() => {
            this.isLoadingRouteIndicator.start();
        });

        this.navigation.navigationStopped$.subscribe(() => {
            this.isLoadingRouteIndicator.stop();
        });

        this.windowService.isMobile$.subscribe((isMobile) => {
            this.makeWindowAdjustments(isMobile);
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

    private configureNotificationsPolling(): void {
        let subscription: Subscription | null = null;
        this.authentication.isLogged$.subscribe((isLogged) => {
            if (isLogged) {
                subscription = this.timer.nextMinute$.subscribe(
                    this.notifications.refresh.bind(this.notifications),
                );
            } else if (subscription) {
                subscription.unsubscribe();
                subscription = null;
            }
        });
    }

    private makeWindowAdjustments(isMobile: boolean): void {
        this.setScalableViewport(!isMobile);

        this.suppressContextMenuSubscription?.unsubscribe();
        if (isMobile) {
            this.suppressContextMenuSubscription = fromEvent(
                document,
                'contextmenu',
            ).subscribe((event) => {
                event.preventDefault();
            });
        } else {
            this.suppressContextMenuSubscription = null;
        }
    }

    private setScalableViewport(scalable: boolean): void {
        const viewport = document.head.querySelector('meta[name="viewport"]')!;
        viewport?.setAttribute(
            'content',
            viewport
                .getAttribute('content')
                ?.replace(
                    `user-scalable=${scalable ? 'no' : 'yes'}`,
                    `user-scalable=${scalable ? 'yes' : 'no'}`,
                ) ?? '',
        );
    }

    public onToastSwipeRight(e: Event): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((e as any).deltaX > 80) {
            this.message.clear();
        }
    }

    public onToastSwipeLeft(e: Event): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((e as any).deltaX < -80) {
            this.mobileToastHideTransformOptions = 'translateX(-100%)';
            this.changeDetector.detectChanges();
            this.message.clear();
            this.mobileToastHideTransformOptions = 'translateX(100%)';
        }
    }
}
