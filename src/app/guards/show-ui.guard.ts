import {
    ActivatedRouteSnapshot,
    CanDeactivate,
    CanDeactivateFn,
    RouterStateSnapshot,
} from '@angular/router';
import { WindowService } from '../services/window.service';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class ShowUIGuard implements CanDeactivate<unknown> {
    constructor(private windowService: WindowService) {}

    public canDeactivate(
        _: unknown,
        __: ActivatedRouteSnapshot,
        ___: RouterStateSnapshot,
    ) {
        this.windowService.setUIvisibility(true);
        return true;
    }
}

export const showUIGuard: CanDeactivateFn<unknown> = (c, r, s) =>
    inject(ShowUIGuard).canDeactivate(c, r, s);
