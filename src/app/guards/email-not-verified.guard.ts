import { Injectable, inject } from '@angular/core';
import {
    CanActivate,
    CanActivateFn,
    CanDeactivate,
    CanDeactivateFn,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
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
}

export const emailVerificationActivateGuard: CanActivateFn = () =>
    inject(EmailVerificationGuard).canActivate();

export const emailVerificationDeactivateGuard: CanDeactivateFn<unknown> = () =>
    inject(EmailVerificationGuard).canDeactivate();
