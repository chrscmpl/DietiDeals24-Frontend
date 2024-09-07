import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { BACKEND_REQUEST } from '../tokens/generic-request.token';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationInterceptor implements HttpInterceptor {
    public intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        if (!request.context.get(BACKEND_REQUEST)) {
            return next.handle(request);
        }

        const authorizationToken = AuthenticationService.authorizationToken;
        if (authorizationToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authorizationToken}`,
                },
            });
        }

        return next.handle(request).pipe(
            tap((event: HttpEvent<unknown>) => {
                if (event instanceof HttpResponse) {
                    AuthenticationService.extractToken(event);
                }
            }),
        );
    }

    public static asHttpInterceptorFn(): HttpInterceptorFn {
        return (req, next) =>
            inject(AuthenticationInterceptor).intercept(req, { handle: next });
    }
}
