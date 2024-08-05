import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';
import { NavigationService } from '../services/navigation.service';

@Injectable()
export class ConfirmReloadGuard {
    constructor(
        private readonly windowService: WindowService,
        private readonly navigation: NavigationService,
    ) {}

    public canActivate(value: boolean): boolean {
        this.navigation.executeIfNavigationSuccessful(() =>
            this.windowService.confirmReload(value),
        );
        return true;
    }
}

export const confirmReloadFnGuard: CanActivateFn = () =>
    inject(ConfirmReloadGuard).canActivate(true);

export const dontConfirmReloadFnGuard: CanActivateFn = () =>
    inject(ConfirmReloadGuard).canActivate(false);
