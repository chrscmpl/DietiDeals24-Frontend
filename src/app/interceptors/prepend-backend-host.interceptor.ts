import {
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BACKEND_REQUEST } from '../tokens/generic-request.token';

@Injectable({
    providedIn: 'root',
})
export class PrependBackendHostInterceptor implements HttpInterceptor {
    public intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        if (!request.context.get(BACKEND_REQUEST)) {
            return next.handle(request);
        }

        return next.handle(
            request.clone({
                url: `${environment.backendHost}/${request.url}`,
            }),
        );
    }

    public static asHttpInterceptorFn(): HttpInterceptorFn {
        return (req, next) =>
            inject(PrependBackendHostInterceptor).intercept(req, {
                handle: next,
            });
    }
}
