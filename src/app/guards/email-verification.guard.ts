import { Injectable, inject } from '@angular/core';
import {
    CanActivate,
    CanActivateFn,
    CanDeactivate,
    CanDeactivateFn,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class EmailVerificationGuard
    implements CanActivate, CanDeactivate<unknown>
{
    constructor(private authenticationService: AuthenticationService) {}

    public canActivate(): boolean {
        return !!this.authenticationService.emailToVerify;
    }

    public canDeactivate(): boolean {
        this.authenticationService.emailToVerify = null;
        return true;
    }

    public static asCanActivateFn() {
        return EmailVerificationGuard.emailVerificationActivateFnGuard;
    }

    public static asCanDeactivateFn() {
        return EmailVerificationGuard.emailVerificationDeactivateFnGuard;
    }

    private static emailVerificationActivateFnGuard: CanActivateFn = () =>
        inject(EmailVerificationGuard).canActivate();

    private static emailVerificationDeactivateFnGuard: CanDeactivateFn<unknown> =
        () => inject(EmailVerificationGuard).canDeactivate();
}
