import { Injectable, inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { AuthenticationService } from '../services/authentication.service';
import { map } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private router: Router,
        private redirection: NavigationService,
        private authenticationService: AuthenticationService,
    ) {}

    public canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authenticationService.isLogged$.pipe(
            map((isLogged) => {
                if (isLogged) return true;
                this.redirection.routeBeforeRedirection = state.url;
                return this.router.parseUrl('/auth');
            }),
        );
    }
}

export const authenticationGuard: CanActivateFn = (r, s) =>
    inject(AuthenticationGuard).canActivate(r, s);

export const notAUthenticatedGuard: CanActivateFn = (_, __) =>
    inject(AuthenticationService).isLogged$.pipe(map((isLogged) => !isLogged));
