import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';

@Injectable()
export class ConfirmReloadGuard implements CanActivate {
    constructor(private windowService: WindowService) {}

    public canActivate(): boolean {
        this.windowService.confirmReload(true);
        return true;
    }
}

export const confirmReloadFnGuard: CanActivateFn = () =>
    inject(ConfirmReloadGuard).canActivate();
