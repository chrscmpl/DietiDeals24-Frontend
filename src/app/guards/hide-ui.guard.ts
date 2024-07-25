import { CanActivate, CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class HideUIGuard implements CanActivate {
    constructor(private windowService: WindowService) {}

    public canActivate() {
        this.windowService.setUIvisibility(false);
        return true;
    }
}

export const hideUIGuard: CanActivateFn = () =>
    inject(HideUIGuard).canActivate();
