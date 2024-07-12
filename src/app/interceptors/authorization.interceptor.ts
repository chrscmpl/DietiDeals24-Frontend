import {
    HttpEvent,
    HttpInterceptorFn,
    HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { EnvironmentService } from '../services/environment.service';

export const authorizationInterceptor: HttpInterceptorFn = (request, next) => {
    if (!request.url.startsWith(inject(EnvironmentService).server)) {
        return next(request);
    }

    const authorizationToken = localStorage.getItem('authorizationToken');
    if (authorizationToken) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${authorizationToken}`,
            },
        });
    }

    return next(request).pipe(
        tap((event: HttpEvent<unknown>) => {
            if (event instanceof HttpResponse) {
                const newToken = event.headers.get('X-Auth-Token');
                if (newToken) {
                    localStorage.setItem('authorizationToken', newToken);
                }
            }
        }),
    );
};
