import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
    constructor() {}

    private static BACKEND_HOSTNAME: string = 'dd24-backend';

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.url != AuthorizationInterceptor.BACKEND_HOSTNAME) {
            return next.handle(request);
        }
        const authorizationToken = localStorage.getItem('authorizationToken');
        if (authorizationToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authorizationToken}`,
                },
            });
        }
        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    const newToken = event.headers.get('X-SetAuthorization');
                    if (newToken) {
                        localStorage.setItem('authorizationToken', newToken);
                    }
                }
            })
        );
    }
}
