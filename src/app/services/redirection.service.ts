import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RedirectionService {
    private _routeBeforeRedirection: string | null = null;

    constructor(private router: Router) {}

    public get routeBeforeRedirection(): string | null {
        return this._routeBeforeRedirection;
    }

    public set routeBeforeRedirection(route: string | null) {
        this._routeBeforeRedirection = route;
    }

    public exitRoute() {
        const redirectRoute = this.routeBeforeRedirection || '/';
        this.routeBeforeRedirection = null;
        this.router.navigate([redirectRoute]);
    }

    public navigateRedirectingBack(route: string) {
        this.routeBeforeRedirection = this.router.url;
        this.router.navigate([route]);
    }
}
