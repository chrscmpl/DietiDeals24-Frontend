import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateFn,
    RouterStateSnapshot,
} from '@angular/router';
import { WindowService } from '../services/window.service';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class HideUIGuard implements CanActivate {
    constructor(private windowService: WindowService) {}

    public canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
        this.windowService.setUIvisibility(false);
        return true;
    }
}

export const hideUIGuard: CanActivateFn = (r, s) =>
    inject(HideUIGuard).canActivate(r, s);
