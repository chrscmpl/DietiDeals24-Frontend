import { inject, Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateFn,
    CanDeactivate,
    CanDeactivateFn,
} from '@angular/router';
import { WindowService } from '../services/window.service';

@Injectable()
export class ConfirmReloadGuard implements CanActivate, CanDeactivate<unknown> {
    constructor(private windowService: WindowService) {}

    public canActivate(): boolean {
        this.windowService.confirmReload(true);
        return true;
    }

    public canDeactivate(): boolean {
        this.windowService.confirmReload(false);
        return true;
    }
}

export const confirmReloadActivateFnGuard: CanActivateFn = () =>
    inject(ConfirmReloadGuard).canActivate();

export const confirmReloadDeactivateFnGuard: CanDeactivateFn<unknown> = () =>
    inject(ConfirmReloadGuard).canDeactivate();
