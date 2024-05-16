import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { RouterLink } from '@angular/router';
import { RoutingUtilsService } from '../../services/routing-utils.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { link, mainPages } from '../../helpers/links';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Observable, catchError, map, of } from 'rxjs';
import { WindowService } from '../../services/window.service';
import { LogoComponent } from '../logo/logo.component';

const HIDDEN_QUERY_PARAMS = ['keywords'];

@Component({
    selector: 'dd24-header',
    standalone: true,
    imports: [
        SearchSectionComponent,
        RouterLink,
        TitleCasePipe,
        AsyncPipe,
        ButtonModule,
        BreadcrumbModule,
        TitleCasePipe,
        LogoComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(
        public authenticationService: AuthenticationService,
        public routingUtils: RoutingUtilsService,
        public windowService: WindowService,
    ) {}

    tabs: link[] = mainPages;
    titleCasePipe: TitleCasePipe = new TitleCasePipe();

    public routes$: Observable<MenuItem[]> =
        this.routingUtils.currentLocation$.pipe(
            map((location) => {
                const url: string[] = [];
                let menuItems: MenuItem[] = this.PathToMenuItems(
                    location.path,
                    url,
                );
                menuItems = menuItems.concat(
                    this.queryToMenuItems(location.query, url),
                );
                return menuItems;
            }),
            catchError((e) => {
                console.error(e);
                return of([]) as Observable<MenuItem[]>;
            }),
        );

    private PathToMenuItems(path: string[], url: string[]): MenuItem[] {
        return path.map((entry) => {
            url.push(entry);
            return {
                label: this.titleCasePipe.transform(entry.replace(/-/g, ' ')),
                routerLink: url,
            };
        });
    }

    private queryToMenuItems(
        query: { [key: string]: string },
        url: string[],
    ): MenuItem[] {
        return Object.entries(query)
            .filter(
                (queryParameter) =>
                    !HIDDEN_QUERY_PARAMS.includes(queryParameter[0]),
            )
            .map((queryParameter) => ({
                label: this.titleCasePipe.transform(queryParameter[1]),
                routerLink: url,
                queryParams: { [queryParameter[0]]: queryParameter[1] },
            }));
    }
}
