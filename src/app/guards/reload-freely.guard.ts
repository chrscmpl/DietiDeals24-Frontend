import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';

@Injectable()
export class ReloadFreelyGuard implements CanActivate {
    constructor(private windowService: WindowService) {}

    public canActivate(): boolean {
        this.windowService.confirmReload(false);
        return true;
    }
}

export const reloadFreelyFnGuard: CanActivateFn = () =>
    inject(ReloadFreelyGuard).canActivate();
