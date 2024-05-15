import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
    Observable,
    distinctUntilChanged,
    filter,
    map,
    shareReplay,
    startWith,
} from 'rxjs';

export interface queryParam {
    name: string;
    value: string;
}

@Injectable({
    providedIn: 'root',
})
export class RoutingUtilsService {
    public currentLocation$: Observable<{
        path: string[];
        query: queryParam[];
    }>;

    public currentPath$: Observable<string[]>;

    public currentQuery$: Observable<queryParam[]>;

    constructor(private router: Router) {
        this.currentLocation$ = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            startWith(null),
            map(() => ({
                path: this.getCurrentPath(),
                query: this.getCurrentQueryParams(),
            })),
            distinctUntilChanged(),
            shareReplay(1),
        );
        this.currentPath$ = this.currentLocation$.pipe(
            map((location) => location.path),
        );
        this.currentQuery$ = this.currentLocation$.pipe(
            map((location) => location.query),
        );
    }

    private getCurrentPath(): string[] {
        const urlTree = this.router.parseUrl(this.router.url);
        const segments = urlTree.root.children['primary']?.segments.map(
            (segment) => segment.path,
        );
        return segments ?? [];
    }

    private getCurrentQueryParams(): queryParam[] {
        const queryParams = this.router.url.split('?')[1]?.split('&') ?? [];
        return queryParams
            .map((paramString: string) => {
                const paramArr: string[] = paramString.split('=');
                if (paramArr.length != 2) return null;
                const param: queryParam = {
                    name: paramArr[0],
                    value: paramArr[1],
                };
                return param;
            })
            .filter((param) => param !== null) as queryParam[];
    }
}
