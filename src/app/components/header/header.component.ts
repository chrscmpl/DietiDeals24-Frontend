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
        this.routingUtils.currentRoutes$.pipe(
            map((routes) => {
                const url: string[] = [];
                return routes.map((route) => {
                    url.push(route);
                    return {
                        label: this.titleCasePipe.transform(
                            route.replace(/-/g, ' '),
                        ),
                        routerLink: url,
                    };
                });
            }),
            catchError((e) => {
                console.error(e);
                return of([]) as Observable<MenuItem[]>;
            }),
        );
}
