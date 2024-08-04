import { CanActivate, CanActivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class ShowUIGuard implements CanActivate {
    constructor(private windowService: WindowService) {}

    public canActivate() {
        this.windowService.setUIvisibility(true);
        return true;
    }
}

export const showUIFnGuard: CanActivateFn = () =>
    inject(ShowUIGuard).canActivate();
