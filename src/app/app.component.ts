import { Component, OnInit } from '@angular/core';
import {
    RouteConfigLoadEnd,
    RouteConfigLoadStart,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
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
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public isLoadingRouteIndicator = new LoadingIndicator(100);

    constructor(
        private router: Router,
        public windowService: WindowService,
        private primengConfig: PrimeNGConfig,
        private themeService: ThemeService,
    ) {}

    ngOnInit(): void {
        this.isLoadingRouteIndicator.start();
        this.configurePrimeNG();
        this.themeService.initTheme();
        this.router.events.subscribe((event) => {
            console.log(event.toString());
        });
    }

    public onMainRouterOutletActivate(): void {
        console.log('onMainRouterOutletActivate');
        this.isLoadingRouteIndicator.stop();
    }

    public onMainRouterOutletDeactivate(): void {
        console.log('onMainRouterOutletDeactivate');
        this.isLoadingRouteIndicator.start();
    }

    private configurePrimeNG(): void {
        this.primengConfig.ripple = true;
    }
}
