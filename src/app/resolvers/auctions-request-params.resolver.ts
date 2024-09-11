import { inject, Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { auctionsPaginationParams } from '../services/auctions.service';

@Injectable({
    providedIn: 'root',
})
export class AuctionsRequestDataResolver {
    public resolve(
        key: string,
        params: auctionsPaginationParams,
    ): Observable<auctionsPaginationParams & { key: string }> {
        return of({ ...params, key });
    }

    public static asResolveFn(
        key: string,
        params: auctionsPaginationParams,
    ): ResolveFn<auctionsPaginationParams & { key: string }> {
        return () => inject(AuctionsRequestDataResolver).resolve(key, params);
    }
}
