import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { mainPages } from '../../helpers/links.helper';
import { Observable, catchError, combineLatest, map, of } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../../services/authentication.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Component({
    selector: 'dd24-sidebar',
    standalone: true,
    imports: [SidebarModule, AsyncPipe, LogoComponent, PanelMenuModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
    private readonly mainPagesMenuItems: MenuItem[] = mainPages.map((page) => {
        return {
            label: page.name,
            routerLink: page.url,
            icon: page.icon,
            command: () => this.hideSidebar(),
        } as MenuItem;
    });

    constructor(
        public readonly windowService: WindowService,
        private readonly categoriesService: CategoriesService,
        private readonly authentication: AuthenticationService,
        private readonly ccService: NgcCookieConsentService,
    ) {
        this.mainPagesMenuItems.splice(this.mainPagesMenuItems.length - 1, 0, {
            label: 'Settings',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Theme',
                    icon: 'pi pi-palette',
                    routerLink: [
                        '',
                        {
                            outlets: {
                                overlay: ['settings', 'theme'],
                            },
                        },
                    ],
                    queryParamsHandling: 'merge',
                    command: () => this.hideSidebar(),
                },
            ],
        });
    }

    public items$: Observable<MenuItem[]> = combineLatest([
        this.categoriesService
            .getTrendingCategories()
            .pipe(catchError(() => of([]))),
        this.authentication.isLogged$,
    ]).pipe(
        map(([categories, isLogged]) => {
            const items: MenuItem[] = [...this.mainPagesMenuItems];
            if (categories.length) {
                const categoriesItem: MenuItem = {
                    label: 'Trending Categories',
                    icon: 'pi pi-chart-line',
                    items: categories.slice(0, 6).map((category) => {
                        return {
                            label: category,
                            routerLink: ['/auctions'],
                            queryParams: { category },
                            command: () => this.hideSidebar(),
                        };
                    }),
                };
                items.splice(items.length - 2, 0, categoriesItem);
            }
            if (isLogged) {
                items.push({
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        this.authentication.logout();
                        this.hideSidebar();
                    },
                    routerLink: ['/'],
                });
            }
            return items;
        }),
    );

    public showCookiePolicy(e: Event): void {
        e.preventDefault();
        this.hideSidebar();
        this.ccService.open();
    }

    public hideSidebar(): void {
        this.windowService.isSidebarVisible = false;
    }
}
