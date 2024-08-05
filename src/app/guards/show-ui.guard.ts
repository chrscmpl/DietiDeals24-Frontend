import { CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';
import { Injectable, inject } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Injectable()
export class ShowUIGuard {
    constructor(
        private windowService: WindowService,
        private readonly navigation: NavigationService,
    ) {}

    public canActivate(value: boolean) {
        this.navigation.executeIfNavigationSuccessful(() =>
            this.windowService.setUIvisibility(value),
        );
        return true;
    }
}

export const showUIFnGuard: CanActivateFn = () =>
    inject(ShowUIGuard).canActivate(true);

export const hideUIFnGuard: CanActivateFn = () =>
    inject(ShowUIGuard).canActivate(false);
