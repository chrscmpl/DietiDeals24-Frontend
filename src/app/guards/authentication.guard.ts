import { Injectable, inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { RedirectionService } from '../services/redirection.service';
import { AuthenticationService } from '../services/authentication.service';
import { map, skipUntil } from 'rxjs';

@Injectable()
export class AuthenticationGuard {
    constructor(
        private router: Router,
        private redirection: RedirectionService,
        private authenticationService: AuthenticationService,
    ) {}

    public canActivate(authenticate: boolean, state: RouterStateSnapshot) {
        return this.authenticationService.isLogged$.pipe(
            skipUntil(this.authenticationService.initialized$),
            map((isLogged) => {
                if (authenticate === isLogged) return true;
                if (!authenticate) return false;
                this.redirection.routeBeforeRedirection = state.url;
                return this.router.parseUrl('/auth');
            }),
        );
    }
}

export const authenticationFnGuard: CanActivateFn = (_, s) =>
    inject(AuthenticationGuard).canActivate(true, s);

export const dontAuthenticateFnGuard: CanActivateFn = (_, s) =>
    inject(AuthenticationGuard).canActivate(false, s);
