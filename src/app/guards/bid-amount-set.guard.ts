import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';

@Injectable()
export class BidAmountSetGuard implements CanActivate {
    constructor(private readonly router: Router) {}

    public canActivate(): boolean {
        return !!this.router.getCurrentNavigation()?.extras?.state?.[
            'bidAmount'
        ];
    }
}

export const bidAmountSetFnGuard: CanActivateFn = () =>
    inject(BidAmountSetGuard).canActivate();
