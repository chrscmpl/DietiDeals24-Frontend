import { CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class ShowUIGuard {
    constructor(private windowService: WindowService) {}

    public canActivate(value: boolean) {
        this.windowService.setUIvisibility(value);
        return true;
    }
}

export const showUIFnGuard: CanActivateFn = () =>
    inject(ShowUIGuard).canActivate(true);

export const hideUIFnGuard: CanActivateFn = () =>
    inject(ShowUIGuard).canActivate(false);
