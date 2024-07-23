import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import {
    Observable,
    auditTime,
    distinctUntilChanged,
    filter,
    map,
    merge,
    shareReplay,
    startWith,
    switchMap,
} from 'rxjs';
import { SearchServiceService } from './search-service.service';
import { AuctionSearchParameters } from '../typeUtils/auction.utils';

type query = Params | AuctionSearchParameters;

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    public currentLocation$: Observable<{
        path: string[];
        query: query;
    }>;

    public currentPath$: Observable<string[]>;

    public currentQuery$: Observable<query>;

    public navigationEnd$ = this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
    );

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private searchService: SearchServiceService,
    ) {
        this.currentLocation$ = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            startWith(null),
            switchMap(() =>
                merge(
                    this.route.queryParams,
                    this.searchService.validatedSearchParameters$,
                ).pipe(auditTime(100)),
            ),
            map((query) => ({
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
