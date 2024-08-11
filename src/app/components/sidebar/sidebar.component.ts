import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { mainPages } from '../../helpers/links';
import { Observable, delay, map, of, startWith, switchMap } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'dd24-sidebar',
    standalone: true,
    imports: [SidebarModule, AsyncPipe, LogoComponent, PanelMenuModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
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
        private readonly accessoryInformation: CategoriesService,
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

    public items$: Observable<MenuItem[]> = of([]);

    ngOnInit() {
        this.items$ = this.accessoryInformation.trendingCategories$.pipe(
            startWith([]),
            switchMap((categories) => {
                if (categories.length === 0)
                    return of(categories).pipe(delay(1000));
                return of(categories);
            }),
            map((categories) => {
                const items: MenuItem[] = [...this.mainPagesMenuItems];
                if (categories.length === 0) return items;
                const categoriesItem: MenuItem = {
                    label: 'Trending Categories',
                    icon: 'pi pi-chart-line',
                    items: categories.map((category) => {
                        return {
                            label: category,
                            routerLink: ['/auctions', { category: category }],
                            command: () => this.hideSidebar(),
                        };
                    }),
                };
                items.splice(items.length - 2, 0, categoriesItem);
                return items;
            }),
        );
    }

    public hideSidebar(): void {
        this.windowService.isSidebarVisible = false;
    }
}
