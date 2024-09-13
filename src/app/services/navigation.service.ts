import { Injectable } from '@angular/core';
import {
    ActivatedRoute,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Params,
    Router,
    UrlTree,
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
import { SearchService } from './search-service.service';
import { AuctionSearchParameters } from '../DTOs/auction-search-parameters.dto';
import { Location } from '@angular/common';

type query = Params | AuctionSearchParameters;

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private _navigationCounter: number = 0;
    private _backAction: ((defaultFn: () => void) => void) | null = null;
    private _routeBeforeRedirection: string | null = null;
    private _savedRoute: string | null = null;
    private _lastRoute: UrlTree = this.getCurrentUrlTree();

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly searchService: SearchService,
        private readonly location: Location,
    ) {
        let _lastRouteTemp!: UrlTree;
        this.navigationStart$.subscribe(() => {
            _lastRouteTemp = this.getCurrentUrlTree();
        });
        this.navigationEnd$.subscribe(() => {
            this._lastRoute = _lastRouteTemp;
            this._navigationCounter++;
        });
        this.location.subscribe(() => {
            this._navigationCounter -= 2;
        });
    }

    public set backAction(action: ((defaultFn: () => void) => void) | null) {
        this._backAction = action;
    }

    public back(): void {
        if (this._backAction) this._backAction(this.onBackDefault.bind(this));
        else this.onBackDefault();
    }

    private onBackDefault() {
        if (this._navigationCounter > 1) this.location.back();
        else this.router.navigate(['/']);
    }

    public currentLocation$: Observable<{
        path: string[];
        query: query;
    }> = this.router.events.pipe(
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

    public currentPath$: Observable<string[]> = this.currentLocation$.pipe(
        map((location) => location.path),
    );

    public currentQuery$: Observable<query> = this.currentLocation$.pipe(
        map((location) => location.query),
    );

    public get lastRoute(): UrlTree {
        return this._lastRoute;
    }

    public navigationStart$: Observable<NavigationStart> =
        this.router.events.pipe(
            filter((event) => event instanceof NavigationStart),
        ) as Observable<NavigationStart>;

    public navigationEnd$: Observable<NavigationEnd> = this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
    ) as Observable<NavigationEnd>;

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
        this.navigateToRoute(this._routeBeforeRedirection);
        this._routeBeforeRedirection = null;
    }

    public navigateRedirectingBack(route: string) {
        this.routeBeforeRedirection = this.router.url;
        this.router.navigate([route]);
    }

    public navigateToSavedRoute() {
        console.log(this._savedRoute);
        this.navigateToRoute(this._savedRoute);
        this._savedRoute = null;
    }

    public set routeBeforeRedirection(route: string | null) {
        this._routeBeforeRedirection = route;
    }

    public set savedRoute(route: string | null) {
        this._savedRoute = route;
    }

    public get primaryOutletRoute(): string {
        return this.router.url.replace(/\(.*?\)/g, '');
    }

    private navigateToRoute(route: string | null) {
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

    private getCurrentUrlTree(): UrlTree {
        return this.router.createUrlTree([], {
            relativeTo: this.router.routerState.root,
            preserveFragment: true,
            queryParamsHandling: 'merge',
        });
    }
}
