import { Injectable } from '@angular/core';
import {
    ActivatedRoute,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    Params,
    Router,
} from '@angular/router';
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
    take,
} from 'rxjs';
import { SearchServiceService } from './search-service.service';
import { AuctionSearchParameters } from '../DTOs/auction-search-parameters.dto';

type query = Params | AuctionSearchParameters;

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private _routeBeforeRedirection: string | null = null;
    private _routeBeforeTransaction: string | null = null;

    public currentLocation$: Observable<{
        path: string[];
        query: query;
    }>;

    public currentPath$: Observable<string[]>;

    public currentQuery$: Observable<query>;

    public navigationEnd$ = this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
    );

    private isCurrentNavigationSuccessful$ = this.router.events.pipe(
        filter(
            (e) =>
                e instanceof NavigationCancel ||
                e instanceof NavigationError ||
                e instanceof NavigationEnd,
        ),
        take(1),
        map((e) => e instanceof NavigationEnd),
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

    public executeIfNavigationSuccessful(fn: () => void): void {
        this.isCurrentNavigationSuccessful$.subscribe((success) => {
            if (success) fn();
        });
    }

    public executeIfNavigationFailure(fn: () => void): void {
        this.isCurrentNavigationSuccessful$.subscribe((success) => {
            if (!success) fn();
        });
    }

    public navigateToRouteBeforeRedirection() {
        this.navigateToSavedRoute(this._routeBeforeRedirection);
        this._routeBeforeRedirection = null;
    }

    public navigateRedirectingBack(route: string) {
        this.routeBeforeRedirection = this.router.url;
        this.router.navigate([route]);
    }

    public navigateToRouteBeforeTransaction() {
        this.navigateToSavedRoute(this._routeBeforeTransaction);
        this._routeBeforeTransaction = null;
    }

    public set routeBeforeRedirection(route: string | null) {
        this._routeBeforeRedirection = route;
    }

    public set routeBeforeTransaction(route: string | null) {
        this._routeBeforeTransaction = route;
    }

    public get primaryOutletRoute(): string {
        return this.router.url.replace(/\(.*?\)/g, '');
    }

    private navigateToSavedRoute(route: string | null) {
        route = route || '/';
        this.executeIfNavigationFailure(() => this.router.navigate(['/']));
        this.router.navigate([route]);
    }

    private getCurrentPath(): string[] {
        const urlTree = this.router.parseUrl(this.router.url);
        const segments = urlTree.root.children['primary']?.segments.map(
            (segment) => segment.path,
        );
        return segments ?? [];
    }
}
