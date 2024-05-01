import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RoutingUtilsService {
    constructor(private router: Router) {}

    get currentRoutes(): { name: string; url: string }[] {
        const ret: { name: string; url: string }[] = [];
        const route = this.router.url.replace(/^\/+|\/+$/g, '');
        let i: number = 0;
        while (i != -1) {
            let j: number = route.indexOf('/', i);
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
