import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn, Router } from '@angular/router';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
    providedIn: 'root',
})
export class SocialUserResolver implements Resolve<SocialUser> {
    public constructor(private readonly router: Router) {}

    public resolve(): SocialUser {
        const user =
            this.router.getCurrentNavigation()?.extras?.state?.['user'];
        if (!user) throw new Error('User not found');
        return user;
    }

    public static asResolveFn(): ResolveFn<SocialUser> {
        return () => inject(SocialUserResolver).resolve();
    }
}
