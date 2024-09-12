import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticatedUserDataResolver
    implements Resolve<AuthenticatedUser>
{
    public constructor(
        private readonly authentication: AuthenticationService,
    ) {}

    public resolve(): Observable<AuthenticatedUser> {
        return this.authentication.getAuthenticatedUserData();
    }

    public static asResolveFn(): ResolveFn<AuthenticatedUser> {
        return () => inject(AuthenticatedUserDataResolver).resolve();
    }
}
