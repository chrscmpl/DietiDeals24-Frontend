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
import { map, withLatestFrom } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private router: Router,
        private redirection: RedirectionService,
        private authenticationService: AuthenticationService,
    ) {}

    public canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authenticationService.isLogged$.pipe(
            withLatestFrom(this.authenticationService.initialized$),
            map(([isLogged, _]) => {
                if (isLogged) return true;
                this.redirection.routeBeforeRedirection = state.url;
                return this.router.parseUrl('/auth');
            }),
        );
    }
}

export const authenticationGuard: CanActivateFn = (r, s) =>
    inject(AuthenticationGuard).canActivate(r, s);

export const notAUthenticatedGuard: CanActivateFn = () =>
    inject(AuthenticationService).isLogged$.pipe(map((isLogged) => !isLogged));
