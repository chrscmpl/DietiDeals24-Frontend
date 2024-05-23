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
    private _isLogged = false;
    private _loggedUser: User | null = null;

    public get isLogged(): boolean {
        return this._isLogged;
    }

    public get loggedUser(): User | null {
        return this._loggedUser;
    }

    private loggedUserSubject = new ReplaySubject<void>(1);
    private isLoggedSubject = new ReplaySubject<void>(1);

    constructor(private http: HttpClient) {
        this.isLoggedSubject.next();
    }

    public isLogged$: Observable<boolean> = this.isLoggedSubject
        .asObservable()
        .pipe(map(() => this.isLogged));

    public loggedUser$: Observable<User> = this.loggedUserSubject
        .asObservable()
        .pipe(
            withLatestFrom(this.isLogged$),
            filter(() => this.isLogged),
            map(() => this.loggedUser as User),
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
                    this._isLogged = true;
                    this._loggedUser = user;
                    this.isLoggedSubject.next();
                    this.loggedUserSubject.next();
                }),
            )
            .subscribe(cb);
    }

    public logout(): void {
        this._isLogged = false;
        this._loggedUser = null;
        this.isLoggedSubject.next();
    }
}
