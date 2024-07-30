import { inject, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateFn,
} from '@angular/router';

@Injectable()
export class ShouldSpecifyChildGuard implements CanActivate {
    constructor() {}

    public canActivate(route: ActivatedRouteSnapshot) {
        return !!route.firstChild;
    }
}

export const shouldSpecifyChildGuard: CanActivateFn = (r) =>
    inject(ShouldSpecifyChildGuard).canActivate(r);
