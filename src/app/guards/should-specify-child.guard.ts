import { inject, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateFn,
} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ShouldSpecifyChildGuard implements CanActivate {
    constructor() {}

    public canActivate(route: ActivatedRouteSnapshot) {
        return !!route.firstChild;
    }

    public static asCanActivateFn() {
        return ShouldSpecifyChildGuard.shouldSpecifyChildFnGuard;
    }

    private static shouldSpecifyChildFnGuard: CanActivateFn = (r) =>
        inject(ShouldSpecifyChildGuard).canActivate(r);
}
