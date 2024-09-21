import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RedirectToPersonalPageGuard {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {}

    public canActivate(route: ActivatedRouteSnapshot) {
        const userId = route.params['user-id'];

        return this.authenticationService.isLogged$.pipe(
            map((isLogged) => {
                return isLogged &&
                    userId === this.authenticationService.loggedUser?.id
                    ? this.router.parseUrl('/your-page')
                    : true;
            }),
        );
    }

    public static asCanActivateFn(): CanActivateFn {
        return (r) => inject(RedirectToPersonalPageGuard).canActivate(r);
    }
}
