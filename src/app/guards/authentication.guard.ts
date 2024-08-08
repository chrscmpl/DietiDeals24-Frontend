import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map, skipUntil } from 'rxjs';
import { NavigationService } from '../services/navigation.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard {
    constructor(
        private router: Router,
        private navigation: NavigationService,
        private authenticationService: AuthenticationService,
    ) {}

    public canActivate(authenticate: boolean, state: RouterStateSnapshot) {
        return this.authenticationService.isLogged$.pipe(
            skipUntil(this.authenticationService.initialized$),
            map((isLogged) => {
                if (authenticate === isLogged) return true;
                if (!authenticate) return false;
                this.navigation.routeBeforeRedirection = state.url;
                return this.router.parseUrl('/auth');
            }),
        );
    }

    public static asCanActivateFn(authenticate: boolean) {
        return authenticate
            ? AuthenticationGuard.authenticationFnGuard
            : AuthenticationGuard.dontAuthenticateFnGuard;
    }

    private static authenticationFnGuard: CanActivateFn = (_, s) =>
        inject(AuthenticationGuard).canActivate(true, s);

    private static dontAuthenticateFnGuard: CanActivateFn = (_, s) =>
        inject(AuthenticationGuard).canActivate(false, s);
}
