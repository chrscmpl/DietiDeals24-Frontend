import {
    HttpEvent,
    HttpInterceptorFn,
    HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs';

const BACKEND_HOSTNAME: string = 'dd24-backend';

export const authorizationInterceptor: HttpInterceptorFn = (request, next) => {
    if (request.url != BACKEND_HOSTNAME) {
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
