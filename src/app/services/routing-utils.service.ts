import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RoutingUtilsService {
    public currentRoutesObservable = new ReplaySubject<string[]>(1);

    public currentRoutes$ = this.currentRoutesObservable.asObservable();

    constructor(private router: Router) {
        this.currentRoutesObservable.next(this.getCurrentRoutes());
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd)
                this.currentRoutesObservable.next(this.getCurrentRoutes());
        });
    }

    private getCurrentRoutes(): string[] {
        const urlTree = this.router.parseUrl(this.router.url);
        const segments = urlTree.root.children['primary']?.segments.map(
            (segment) => segment.path,
        );
        return segments ?? [];
    }
}
