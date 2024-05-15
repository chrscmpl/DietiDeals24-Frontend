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

@Injectable({
    providedIn: 'root',
})
export class RoutingUtilsService {
    public currentRoutes$: Observable<string[]>;

    constructor(private router: Router) {
        this.currentRoutes$ = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            startWith(null),
            map(() => this.getCurrentRoutes()),
            distinctUntilChanged(),
            shareReplay(1),
        );
    }

    private getCurrentRoutes(): string[] {
        const urlTree = this.router.parseUrl(this.router.url);
        const segments = urlTree.root.children['primary']?.segments.map(
            (segment) => segment.path,
        );
        return segments ?? [];
    }
}
