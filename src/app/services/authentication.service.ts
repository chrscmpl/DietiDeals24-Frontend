import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials, User, UserDTO } from '../models/user.model';
import {
    Observable,
    Observer,
    ReplaySubject,
    filter,
    map,
    tap,
    withLatestFrom,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private loggedUserSubject: ReplaySubject<User> = new ReplaySubject<User>(1);
    private isLoggedSubject: ReplaySubject<boolean> =
        new ReplaySubject<boolean>(1);

    constructor(private http: HttpClient) {
        this.isLoggedSubject.next(false);
    }

    public isLogged$: Observable<boolean> = this.isLoggedSubject.asObservable();

    public loggedUser$: Observable<User> = this.loggedUserSubject
        .asObservable()
        .pipe(
            withLatestFrom(this.isLogged$),
            filter(([_, isLogged]) => isLogged),
            map(([user, _]) => user),
        );

    public login(
        credentials: UserCredentials,
        cb?: Partial<Observer<User>>,
    ): void {
        this.http
            .post<UserDTO>('dd24-backend/login', credentials)
            .pipe(
                map((dto: UserDTO) => new User(dto)),
                tap((user) => {
                    this.isLoggedSubject.next(true);
                    this.loggedUserSubject.next(user);
                }),
            )
            .subscribe(cb);
    }

    public logout(): void {
        this.isLoggedSubject.next(false);
    }
}
