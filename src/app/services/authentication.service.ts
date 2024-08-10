import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../models/user.model';
import {
    Observable,
    Observer,
    ReplaySubject,
    catchError,
    filter,
    map,
    switchMap,
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
import { LoginException } from '../exceptions/login.exception';
import { GetUserDataException } from '../exceptions/get-user-data.exception';
import { RegistrationException } from '../exceptions/registration.exception';
import { EmailVerificationException } from '../exceptions/email-verification.exception';

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
        if (AuthenticationService.authorizationToken)
            this.getUserDataObservable().subscribe();
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
            .post(`${environment.backendHost}/login`, credentials, {
                observe: 'response',
            })
            .pipe(
                catchError((e) => throwError(() => new LoginException(e))),
                switchMap((res: HttpResponse<unknown>) => {
                    AuthenticationService.extractToken(res);
                    return this.getUserDataObservable();
                }),
            )
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
            .pipe(
                catchError((e) =>
                    throwError(() => new RegistrationException(e)),
                ),
            )
            .subscribe(cb);
    }

    public verifyEmail(
        data: emailVerificationDTO,
        cb?: Partial<Observer<unknown>>,
    ): void {
        this.http
            .post(`${environment.backendHost}/register/confirm`, data, {
                observe: 'response',
            })
            .pipe(
                catchError((e) =>
                    throwError(() => new EmailVerificationException(e)),
                ),
                switchMap((res: HttpResponse<unknown>) => {
                    AuthenticationService.extractToken(res);
                    return this.getUserDataObservable();
                }),
            )
            .subscribe(cb);
    }

    private getUserDataObservable(): Observable<AuthenticatedUser> {
        return this.http
            .get<AuthenticatedUserDTO>(
                `${environment.backendHost}/profile/owner-view`,
            )
            .pipe(
                map((dto: AuthenticatedUserDTO) => new AuthenticatedUser(dto)),
                tap(this.setLoggedUser.bind(this)),
                catchError((e) => {
                    this.setInitialized();
                    return throwError(() => new GetUserDataException(e));
                }),
            );
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

    // These methods need to be static because they are needed in an HttpInterceptor.
    // As this service depends on HttpClient, it cannot be injected in the HttpInterceptor,
    // as it would create a circular dependency

    public static extractToken(res: HttpResponse<unknown>): void {
        const token = res.headers.get('X-Auth-Token');
        if (token) this.authorizationToken = token;
    }

    private static set authorizationToken(token: string) {
        localStorage.setItem('authorizationToken', token);
    }

    public static get authorizationToken(): string | null {
        return localStorage.getItem('authorizationToken');
    }
}
