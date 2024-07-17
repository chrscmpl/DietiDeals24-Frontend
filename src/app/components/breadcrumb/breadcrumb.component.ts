import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { NavigationService } from '../../services/navigation.service';
import { MenuItem } from 'primeng/api';
import { catchError, map, Observable, of } from 'rxjs';

const HIDDEN_QUERY_PARAMS = ['keywords'];

@Component({
    selector: 'dd24-breadcrumb',
    standalone: true,
    imports: [BreadcrumbModule, AsyncPipe],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
    constructor(
        public readonly titleCasePipe: TitleCasePipe,
        public readonly routingUtils: NavigationService,
    ) {}

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
