import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { auctionsPaginationParams } from '../services/auctions.service';

@Injectable({
    providedIn: 'root',
})
export class AuctionsRequestDataResolver {
    public resolve(
        route: ActivatedRouteSnapshot,
        key: string,
        params: auctionsPaginationParams,
        options?: { useParent?: boolean; userParam?: string },
    ): Observable<auctionsPaginationParams & { key: string }> {
        const usedRoute =
            options?.useParent && route.parent ? route.parent : route;

        return of({
            ...params,
            key,
            ofUser: options?.userParam
                ? usedRoute.params[options.userParam]
                : undefined,
        });
    }

    public static asResolveFn(
        key: string,
        params: auctionsPaginationParams,
        options?: { useParent?: boolean; userParam?: string },
    ): ResolveFn<auctionsPaginationParams & { key: string }> {
        return (r) =>
            inject(AuctionsRequestDataResolver).resolve(
                r,
                key,
                params,
                options,
            );
    }
}
