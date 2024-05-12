import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

interface route {
    name: string;
    url: string;
}

@Injectable({
    providedIn: 'root',
})
export class RoutingUtilsService {
    public currentRoutesObservable = new ReplaySubject<route[]>(1);

    public currentRoutes$ = this.currentRoutesObservable.asObservable();

    constructor(private router: Router) {
        this.currentRoutesObservable.next(this.getCurrentRoutes());
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd)
                this.currentRoutesObservable.next(this.getCurrentRoutes());
        });
    }

    private getCurrentRoutes(): route[] {
        const ret: route[] = [];
        const route = this.router.url.replace(/^\/+|\/+$/g, '');
        let i: number = 0;
        while (i != -1) {
            const j: number = route.indexOf('/', i);
            ret.push({
                name: route
                    .substring(i, j !== -1 ? j : route.length)
                    .split('-')
                    .join(' '),
                url: route.substring(0, j !== -1 ? j : route.length),
            });
            i = j;
        }
        return ret;
    }
}
