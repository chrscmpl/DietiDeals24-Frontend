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
import { GetAuthenticatedUserDataException } from '../exceptions/get-authenticated-user-data.exception';
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
import { editableUserData } from '../models/editable-user-data.model';
import { EditableUserDataSerializer } from '../serializers/editable-user-data.serializer';
import { EditUserDataException } from '../exceptions/edit-user-data.exception';
import { PasswordChangeDataSerializer } from '../serializers/password-change-data.serializer';
import { PasswordChangeData } from '../models/password-change-data.model';
import { ChangePasswordException } from '../exceptions/change-password.exception';
import { RequestForgottenPasswordResetException } from '../exceptions/request-forgotten-password-reset.exception';
import { ResetForgottenPasswordData } from '../models/reset-forgotten-password-data.model';
import { ResetForgottenPasswordException } from '../exceptions/reset-forgotten-password.exception';
import { ResetForgottenPasswordDataSerializer } from '../serializers/reset-forgotten-password-data.serializer';
import { RequestForgottenPasswordEmailSerializer } from '../serializers/request-forgotten-password-email-data.serializer';
import { RequestForgottenPasswordEmailData } from '../models/request-forgotten-password-email-data.model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _isLogged = false;
    private _loggedUser: AuthenticatedUser | null = null;

    public emailToVerify: string | null = null;

    public get isLogged(): boolean {
        return this._isLogged;
    }

    public get loggedUser(): AuthenticatedUser | null {
        return this._loggedUser;
    }

    private readonly loggedUserSubject = new ReplaySubject<void>(1);
    private readonly isLoggedSubject = new ReplaySubject<void>(1);

    constructor(
        private readonly http: HttpClient,
        private readonly deserializer: AuthenticatedUserDeserializer,
        private readonly registrationSerializer: UserRegistrationSerializer,
        private readonly editableUserDataSerializer: EditableUserDataSerializer,
        private readonly userLinkSerializer: UserLinkSerializer,
        private readonly passwordChangeDataSerializer: PasswordChangeDataSerializer,
        private readonly requestForgottenPasswordEmailSerializer: RequestForgottenPasswordEmailSerializer,
        private readonly resetForgottenPasswordDataSerializer: ResetForgottenPasswordDataSerializer,
        private readonly emailVerificationSerializer: EmailVerificationSerializer,
        private readonly messageService: MessageService,
    ) {
        if (AuthenticationService.authorizationToken)
            this.loginUsingToken().subscribe();
        else this.isLoggedSubject.next();
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
            catchError((e) =>
                throwError(() => new GetAuthenticatedUserDataException(e)),
            ),
        );
    }

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.authenticatedUserData$,
    })
    public editUser(data: editableUserData): Observable<unknown> {
        return this.http
            .post(
                'profile/update',
                this.editableUserDataSerializer.serialize(data),
                {
                    responseType: 'text',
                },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new EditUserDataException(e)),
                ),
            );
    }

    public changePassword(data: PasswordChangeData): Observable<unknown> {
        return this.http
            .post(
                'profile/update/password',
                this.passwordChangeDataSerializer.serialize(data),
                {
                    responseType: 'text',
                },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new ChangePasswordException(e)),
                ),
            );
    }

    public requestForgottenPasswordReset(
        data: RequestForgottenPasswordEmailData,
    ): Observable<unknown> {
        return this.http
            .post(
                'password/forgot/reset/init',
                this.requestForgottenPasswordEmailSerializer.serialize(data),
                { responseType: 'text' },
            )
            .pipe(
                catchError((e) =>
                    throwError(
                        () => new RequestForgottenPasswordResetException(e),
                    ),
                ),
            );
    }

    public resetForgottenPassword(
        data: ResetForgottenPasswordData,
    ): Observable<unknown> {
        return this.http
            .post(
                'password/forgot/reset/finalize',
                this.resetForgottenPasswordDataSerializer.serialize(data),
                { responseType: 'text' },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new ResetForgottenPasswordException(e)),
                ),
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
                this._isLogged = false;
                this.isLoggedSubject.next();
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
        this._isLogged = true;
        this._loggedUser = user;
        this.isLoggedSubject.next();
        this.loggedUserSubject.next();
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
