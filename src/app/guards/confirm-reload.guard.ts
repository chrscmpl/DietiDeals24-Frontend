import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';

@Injectable()
export class ConfirmReloadGuard {
    constructor(private windowService: WindowService) {}

    public canActivate(value: boolean): boolean {
        this.windowService.confirmReload(value);
        return true;
    }
}

export const confirmReloadFnGuard: CanActivateFn = () =>
    inject(ConfirmReloadGuard).canActivate(true);

export const dontConfirmReloadFnGuard: CanActivateFn = () =>
    inject(ConfirmReloadGuard).canActivate(false);
