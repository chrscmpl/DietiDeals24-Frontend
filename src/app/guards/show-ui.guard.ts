import { CanDeactivate, CanDeactivateFn } from '@angular/router';
import { WindowService } from '../services/window.service';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class ShowUIGuard implements CanDeactivate<unknown> {
    constructor(private windowService: WindowService) {}

    public canDeactivate() {
        this.windowService.setUIvisibility(true);
        return true;
    }
}

export const showUIFnGuard: CanDeactivateFn<unknown> = () =>
    inject(ShowUIGuard).canDeactivate();
