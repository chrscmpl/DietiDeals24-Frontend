import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials, User, UserDTO } from '../models/user.model';
import { Observable, ReplaySubject, filter, map, tap } from 'rxjs';

interface UserSubscribeCallbacks {
    next?: (data: User) => void;
    error?: (err: any) => void;
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private loggedUserSubject: ReplaySubject<User> = new ReplaySubject<User>(1);
    private isLoggedSubject: ReplaySubject<boolean> =
        new ReplaySubject<boolean>(1);
    private _isLogged: boolean = false;

    constructor(private http: HttpClient) {
        this.isLoggedSubject.next(false);
    }

    private get isLogged(): boolean {
        return this._isLogged;
    }

    private set isLogged(value: boolean) {
        this._isLogged = value;
        this.isLoggedSubject.next(value);
    }

    private set loggedUser(user: User) {
        this.loggedUserSubject.next(user);
    }

    public isLogged$: Observable<boolean> = this.isLoggedSubject.asObservable();

    public loggedUser$: Observable<User> = this.loggedUserSubject
        .asObservable()
        .pipe(filter(() => this.isLogged));

    public login(
        credentials: UserCredentials,
        cb?: UserSubscribeCallbacks,
    ): void {
        this.http
            .post<UserDTO>('dd24-backend/login', credentials)
            .pipe(
                map((dto: UserDTO) => new User(dto)),
                tap((user) => {
                    this.isLogged = true;
                    this.loggedUser = user;
                }),
            )
            .subscribe(cb);
    }

    public logout(): void {
        this.isLogged = false;
    }
}
