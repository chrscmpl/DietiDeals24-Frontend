import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { mainPages } from '../../helpers/links';
import { Observable, map, of } from 'rxjs';
import { AccessoryInformationService } from '../../services/accessory-information.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'dd24-sidebar',
    standalone: true,
    imports: [SidebarModule, AsyncPipe, LogoComponent, PanelMenuModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
    constructor(
        public windowService: WindowService,
        private accessoryInformation: AccessoryInformationService,
    ) {}

    public items$: Observable<MenuItem[]> = of([]);

    ngOnInit() {
        this.items$ = this.accessoryInformation.trendingCategories$.pipe(
            map((categories) => {
                const items: MenuItem[] = mainPages.map((page) => {
                    return {
                        label: page.name,
                        routerLink: page.url,
                        icon: page.icon,
                    };
                });
                const categoriesItem: MenuItem = {
                    label: 'Trending Categories',
                    items: categories.map((category) => {
                        return {
                            label: category,
                            routerLink: ['/search', { category: category }],
                        };
                    }),
                };
                items.splice(items.length - 1, 0, categoriesItem);
                return items;
            }),
        );
    }
}
