import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
    public constructor(private readonly usersService: UserService) {}

    public resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.usersService.getUser(route.params['user-id']);
    }

    public static asResolveFn(): ResolveFn<User> {
        return (r) => inject(UserResolver).resolve(r);
    }
}
