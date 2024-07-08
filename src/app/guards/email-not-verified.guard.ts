import { Injectable, inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateFn,
    CanDeactivate,
    CanDeactivateFn,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class EmailVerificationGuard
    implements CanActivate, CanDeactivate<unknown>
{
    constructor(private authenticationService: AuthenticationService) {}

    public canActivate(
        _: ActivatedRouteSnapshot,
        __: RouterStateSnapshot,
    ): boolean {
        return !!this.authenticationService.emailToVerify;
    }

    public canDeactivate(
        _: unknown,
        __: ActivatedRouteSnapshot,
        ___: RouterStateSnapshot,
    ): boolean {
        this.authenticationService.emailToVerify = null;
        return true;
    }
}

export const emailVerificationActivateGuard: CanActivateFn = (r, s) =>
    inject(EmailVerificationGuard).canActivate(r, s);

export const emailVerificationDeactivateGuard: CanDeactivateFn<unknown> = (
    c,
    s,
    r,
) => inject(EmailVerificationGuard).canDeactivate(c, s, r);
