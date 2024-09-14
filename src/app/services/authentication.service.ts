import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import {
    Observable,
    Observer,
    ReplaySubject,
    catchError,
    distinctUntilChanged,
    filter,
    map,
    switchMap,
    tap,
    throwError,
    withLatestFrom,
} from 'rxjs';
import { UserCredentials } from '../DTOs/authentication.dto';
import { AuthenticatedUserDTO } from '../DTOs/authentication.dto';
import { LoginException } from '../exceptions/login.exception';
import { GetUserDataException } from '../exceptions/get-user-data.exception';
import { RegistrationException } from '../exceptions/registration.exception';
import { EmailVerificationException } from '../exceptions/email-verification.exception';
import { AuthenticatedUserDeserializer } from '../deserializers/authenticated-user.deserializer';
import { UserRegistrationSerializer } from '../serializers/user-registration-data.serializer';
import { UserRegistrationData } from '../models/user-registration-data.model';
import { EmailVerificationSerializer } from '../serializers/email-verification.serializer';
import { emailVerificationData } from '../models/email-verification-data.model';
import { MessageService } from 'primeng/api';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { isEqual } from 'lodash-es';
import { cacheBusters } from '../helpers/cache-busters';
import { userLinkCreationData } from '../models/user-link.model';
import { UserLinkSerializer } from '../serializers/user-link.serializer';
import { DeleteUserLinkException } from '../exceptions/delete-user-link.exception';
import { SaveUserLinkException } from '../exceptions/save-user-link.exception';

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

    constructor(
        private readonly http: HttpClient,
        private readonly deserializer: AuthenticatedUserDeserializer,
        private readonly registrationSerializer: UserRegistrationSerializer,
        private readonly userLinkSerializer: UserLinkSerializer,
        private readonly emailVerificationSerializer: EmailVerificationSerializer,
        private readonly messageService: MessageService,
    ) {
        this.isLoggedSubject.next();
        if (AuthenticationService.authorizationToken)
            this.loginUsingToken().subscribe();
        else this.setInitialized();
    }

    public readonly isLogged$: Observable<boolean> = this.isLoggedSubject
        .asObservable()
        .pipe(
            map(() => this.isLogged),
            distinctUntilChanged(),
        );

    public readonly loggedUser$: Observable<AuthenticatedUser> =
        this.loggedUserSubject.asObservable().pipe(
            withLatestFrom(this.isLogged$),
            filter(() => this.isLogged),
            map(() => this.loggedUser as AuthenticatedUser),
            distinctUntilChanged(isEqual),
        );

    public readonly initialized$: Observable<void> =
        this.initializedSubject.asObservable();

    public login(
        credentials: UserCredentials,
        cb?: Partial<Observer<unknown>>,
    ): void {
        this.http
            .post('login', credentials, {
                observe: 'response',
            })
            .pipe(
                catchError((e) => throwError(() => new LoginException(e))),
                switchMap((res: HttpResponse<unknown>) => {
                    AuthenticationService.extractToken(res);
                    return this.loginUsingToken();
                }),
            )
            .subscribe(cb);
    }

    public register(
        newUser: UserRegistrationData,
        cb?: Partial<Observer<string>>,
    ): void {
        this.http
            .post(
                'register/init',
                this.registrationSerializer.serialize(newUser),
                {
                    responseType: 'text',
                },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new RegistrationException(e)),
                ),
            )
            .subscribe(cb);
    }

    public verifyEmail(
        data: emailVerificationData,
        cb?: Partial<Observer<unknown>>,
    ): void {
        this.http
            .post(
                'register/confirm',
                this.emailVerificationSerializer.serialize(data),
                {
                    observe: 'response',
                },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new EmailVerificationException(e)),
                ),
                switchMap((res: HttpResponse<unknown>) => {
                    AuthenticationService.extractToken(res);
                    return this.loginUsingToken();
                }),
            )
            .subscribe(cb);
    }

    @Cacheable({
        cacheBusterObserver: cacheBusters.authenticatedUserData$,
    })
    public getAuthenticatedUserData(): Observable<AuthenticatedUser> {
        return this.http.get<AuthenticatedUserDTO>(`profile/owner-view`).pipe(
            map((dto: AuthenticatedUserDTO) =>
                this.deserializer.deserialize(dto),
            ),
            tap(this.setLoggedUser.bind(this)),
            catchError((e) => throwError(() => new GetUserDataException(e))),
        );
    }

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.authenticatedUserData$,
    })
    public addLink(link: userLinkCreationData): Observable<unknown> {
        return this.http
            .post(
                'profile/links/new',
                this.userLinkSerializer.serialize(link),
                {
                    responseType: 'text',
                },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new SaveUserLinkException(e)),
                ),
            );
    }

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.authenticatedUserData$,
    })
    public deleteLink(linkId: string): Observable<unknown> {
        return this.http
            .delete('profile/links/delete', {
                params: { linkId },
                responseType: 'text',
            })
            .pipe(
                catchError((e) =>
                    throwError(() => new DeleteUserLinkException(e)),
                ),
            );
    }

    private loginUsingToken(): Observable<AuthenticatedUser> {
        return this.getAuthenticatedUserData().pipe(
            catchError((e) => {
                this.setInitialized();
                if (
                    e.status >= 400 &&
                    e.status < 500 &&
                    AuthenticationService.authorizationToken
                ) {
                    AuthenticationService.authorizationToken = null;
                    this.showExpiredTokenError();
                }
                return throwError(() => e);
            }),
        );
    }

    public logout(): void {
        AuthenticationService.authorizationToken = null;
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

    private showExpiredTokenError(): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Session expired',
            detail: 'Your session has expired. Please log in again.',
        });
    }

    // These methods need to be static because they are needed in an HttpInterceptor.
    // As this service depends on HttpClient, it cannot be injected in the HttpInterceptor,
    // as it would create a circular dependency

    public static extractToken(res: HttpResponse<unknown>): void {
        const token = res.headers.get('X-Auth-Token');
        if (token) this.authorizationToken = token;
    }

    private static set authorizationToken(token: string | null) {
        if (token) localStorage.setItem('authorizationToken', token);
        else localStorage.removeItem('authorizationToken');
    }

    public static get authorizationToken(): string | null {
        return localStorage.getItem('authorizationToken');
    }
}
