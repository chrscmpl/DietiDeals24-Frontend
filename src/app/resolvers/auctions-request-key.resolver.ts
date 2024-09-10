import { inject, Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
    auctionsPaginationParams,
    AuctionsService,
} from '../services/auctions.service';

@Injectable({
    providedIn: 'root',
})
export class AuctionsRequestKeyResolver {
    public constructor(private readonly auctionsService: AuctionsService) {}

    public resolve(
        key: string,
        params: auctionsPaginationParams,
    ): Observable<string> {
        this.auctionsService.setIfAbsent(key, params);
        return of(key);
    }

    public static asResolveFn(
        key: string,
        params: auctionsPaginationParams,
    ): ResolveFn<string> {
        return () => inject(AuctionsRequestKeyResolver).resolve(key, params);
    }
}
