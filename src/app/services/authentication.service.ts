import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {
    Observable,
    Observer,
    ReplaySubject,
    filter,
    map,
    tap,
    withLatestFrom,
} from 'rxjs';
import {
    UserCredentials,
    UserDTO,
    UserRegistrationDTO,
    emailVerificationDTO,
} from '../DTOs/user.dto';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _isLogged = false;
    private _loggedUser: User | null = null;

    public emailToVerify: string | null = null;

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
                tap(this.setLoggedUser.bind(this)),
            )
            .subscribe(cb);
    }

    public register(
        newUser: UserRegistrationDTO,
        cb?: Partial<Observer<void>>,
    ): void {
        this.http
            .post<void>('dd24-backend/register/init', newUser)
            .subscribe(cb);
    }

    public verifyEmail(
        data: emailVerificationDTO,
        cb?: Partial<Observer<User>>,
    ): void {
        this.http
            .post<UserDTO>('dd24-backend/register/confirm', data)
            .pipe(
                map((dto: UserDTO) => new User(dto)),
                tap(this.setLoggedUser.bind(this)),
            )
            .subscribe(cb);
    }

    public getUserData(cb?: Partial<Observer<User>>): void {
        if (!cb) cb = {};
        const error = cb.error ?? (() => {});
        cb.error = (err) => {
            error(err);
            localStorage.removeItem('authorizationToken');
        };

        this.http
            .get<UserDTO>('dd24-backend/profile/owner-view')
            .pipe(
                map((dto: UserDTO) => new User(dto)),
                tap(this.setLoggedUser.bind(this)),
            )
            .subscribe(cb);
    }

    public logout(): void {
        localStorage.removeItem('authorizationToken');
        this._isLogged = false;
        this._loggedUser = null;
        this.isLoggedSubject.next();
    }

    private setLoggedUser(user: User): void {
        this._isLogged = true;
        this._loggedUser = user;
        this.isLoggedSubject.next();
        this.loggedUserSubject.next();
    }
}
