import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicator } from './helpers/loadingIndicator';
import { AsyncPipe } from '@angular/common';
import { WindowService } from './services/window.service';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { StretchOnScrollDirective } from './directives/stretch-on-scroll.directive';
import { SmartStickyDirective } from './directives/smart-sticky.directive';
import { AuthenticationService } from './services/authentication.service';

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
        StretchOnScrollDirective,
        SmartStickyDirective,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public readonly isLoadingRouteIndicator = new LoadingIndicator(100);

    constructor(
        public readonly windowService: WindowService,
        private readonly primengConfig: PrimeNGConfig,
        private readonly themeService: ThemeService,
        private readonly authentication: AuthenticationService,
    ) {}

    ngOnInit(): void {
        this.isLoadingRouteIndicator.start();
        this.configurePrimeNG();
        this.themeService.initTheme();
        if (localStorage.getItem('authorizationToken')) {
            this.authentication.getUserData();
        }
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
}
