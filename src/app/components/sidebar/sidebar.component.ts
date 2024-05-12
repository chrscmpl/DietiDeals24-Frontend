import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { mainPages } from '../../helpers/links';
import { Observable, delay, map, of, startWith, switchMap } from 'rxjs';
import { AccessoryInformationService } from '../../services/accessory-information.service';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'dd24-sidebar',
    standalone: true,
    imports: [SidebarModule, AsyncPipe, LogoComponent, PanelMenuModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
    private mainPagesMenuItems: MenuItem[] = mainPages.map((page) => {
        return {
            label: page.name,
            routerLink: page.url,
            icon: page.icon,
            command: () => this.hideSidebar(),
        } as MenuItem;
    });

    constructor(
        public windowService: WindowService,
        private accessoryInformation: AccessoryInformationService,
        private themeService: ThemeService,
    ) {
        this.mainPagesMenuItems.splice(this.mainPagesMenuItems.length - 1, 0, {
            label: 'Theme',
            items: [
                {
                    label: 'Light',
                    command: () => this.themeService.setTheme('light'),
                },
                {
                    label: 'Dark',
                    command: () => this.themeService.setTheme('dark'),
                },
                {
                    label: 'System',
                    command: () => this.themeService.setTheme('system'),
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
                    items: categories.map((category) => {
                        return {
                            label: category,
                            routerLink: ['/search', { category: category }],
                            command: () => this.hideSidebar(),
                        };
                    }),
                };
                items.splice(items.length - 2, 0, categoriesItem);
                return items;
            }),
        );
    }

    private hideSidebar(): void {
        this.windowService.isSidebarVisible = false;
    }
}
