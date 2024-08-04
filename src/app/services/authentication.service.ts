import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../models/user.model';
import {
    Observable,
    Observer,
    ReplaySubject,
    catchError,
    filter,
    map,
    tap,
    throwError,
    withLatestFrom,
} from 'rxjs';
import {
    UserCredentials,
    AuthenticatedUserDTO,
    UserRegistrationDTO,
    emailVerificationDTO,
} from '../DTOs/user.dto';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _isLogged = false;
    private _loggedUser: AuthenticatedUser | null = null;
    private _initialized = false;

    public emailToVerify: string | null = null;

    public get isLogged(): boolean {
        return this._isLogged;
    }

    public get loggedUser(): AuthenticatedUser | null {
        return this._loggedUser;
    }

    private readonly initializedSubject = new ReplaySubject<void>(1);
    private readonly loggedUserSubject = new ReplaySubject<void>(1);
    private readonly isLoggedSubject = new ReplaySubject<void>(1);

    constructor(private readonly http: HttpClient) {
        this.isLoggedSubject.next();
        if (localStorage.getItem('authorizationToken')) this.getUserData();
        else this.setInitialized();
    }

    public readonly isLogged$: Observable<boolean> = this.isLoggedSubject
        .asObservable()
        .pipe(map(() => this.isLogged));

    public readonly loggedUser$: Observable<AuthenticatedUser> =
        this.loggedUserSubject.asObservable().pipe(
            withLatestFrom(this.isLogged$),
            filter(() => this.isLogged),
            map(() => this.loggedUser as AuthenticatedUser),
        );

    public readonly initialized$: Observable<void> =
        this.initializedSubject.asObservable();

    public login(
        credentials: UserCredentials,
        cb?: Partial<Observer<unknown>>,
    ): void {
        this.http
            .post(`${environment.backendHost}/login`, credentials)
            .pipe(tap(this.getUserData.bind(this)))
            .subscribe(cb);
    }

    public register(
        newUser: UserRegistrationDTO,
        cb?: Partial<Observer<string>>,
    ): void {
        this.http
            .post(`${environment.backendHost}/register/init`, newUser, {
                responseType: 'text',
            })
            .subscribe(cb);
    }

    public verifyEmail(
        data: emailVerificationDTO,
        cb?: Partial<Observer<unknown>>,
    ): void {
        this.http
            .post(`${environment.backendHost}/register/confirm`, data)
            .pipe(tap(this.getUserData.bind(this)))
            .subscribe(cb);
    }

    public getUserData(cb?: Partial<Observer<AuthenticatedUser>>): void {
        this.http
            .get<AuthenticatedUserDTO>(
                `${environment.backendHost}/profile/owner-view`,
            )
            .pipe(
                map((dto: AuthenticatedUserDTO) => new AuthenticatedUser(dto)),
                tap(this.setLoggedUser.bind(this)),
                catchError((e) => {
                    this.setInitialized();
                    return throwError(() => e);
                }),
            )
            .subscribe(cb);
    }

    public logout(): void {
        localStorage.removeItem('authorizationToken');
        this._isLogged = false;
        this._loggedUser = null;
        this.isLoggedSubject.next();
    }

    private setLoggedUser(user: AuthenticatedUser): void {
        this.setInitialized();
        this._isLogged = true;
        this._loggedUser = user;
        this.isLoggedSubject.next();
        this.loggedUserSubject.next();
    }

    private setInitialized() {
        if (this._initialized) return;
        this._initialized = true;
        this.initializedSubject.next();
    }
}
