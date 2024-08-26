import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, throwError } from 'rxjs';
import { BidCreationDTO } from '../DTOs/bid.dto';
import { environment } from '../../environments/environment';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AuthenticationService } from './authentication.service';
import { BidPlacementException } from '../exceptions/bid-placement.exception';
import { AuctionDTO } from '../DTOs/auction.dto';
import { auctionBuilder } from '../helpers/builders/auction-builder';
import { Auction } from '../models/auction.model';

export const ActiveBidsCacheBuster$ = new Subject<void>();

@Injectable({
    providedIn: 'root',
})
export class BidService {
    constructor(
        private readonly http: HttpClient,
        private readonly auth: AuthenticationService,
    ) {
        this.auth.isLogged$.subscribe((isLogged) => {
            ActiveBidsCacheBuster$.next();
            if (isLogged) {
                this.refreshOwnActiveBids();
            }
        });
    }

    public refreshOwnActiveBids(): void {
        this.getOwnActiveBids().subscribe();
    }

    @CacheBuster({
        cacheBusterNotifier: ActiveBidsCacheBuster$,
    })
    public placeBid(bid: BidCreationDTO): Observable<unknown> {
        return this.http
            .post(`${environment.backendHost}/bids/new`, bid, {
                responseType: 'text',
            })
            .pipe(
                catchError((e) =>
                    throwError(() => new BidPlacementException(e)),
                ),
            );
    }

    @Cacheable({
        cacheBusterObserver: ActiveBidsCacheBuster$,
    })
    public getOwnActiveBids(): Observable<Auction[]> {
        return this.http
            .get<AuctionDTO[]>(`${environment.backendHost}/bids/active`)
            .pipe(
                map((dtos) => auctionBuilder.buildArray(dtos)),
                catchError(() => of([])),
            );
    }
}
