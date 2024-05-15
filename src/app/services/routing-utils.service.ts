import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
    Observable,
    combineLatest,
    distinctUntilChanged,
    filter,
    map,
    merge,
    shareReplay,
    startWith,
    withLatestFrom,
} from 'rxjs';

interface query {
    [key: string]: string;
}

@Injectable({
    providedIn: 'root',
})
export class RoutingUtilsService {
    public currentLocation$: Observable<{
        path: string[];
        query: query;
    }>;

    public currentPath$: Observable<string[]>;

    public currentQuery$: Observable<query>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.currentLocation$ = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            startWith(null),
            withLatestFrom(this.route.queryParams),
            map(([_, query]) => ({
                path: this.getCurrentPath(),
                query: query,
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
}
