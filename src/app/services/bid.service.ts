import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, throwError } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AuthenticationService } from './authentication.service';
import { BidPlacementException } from '../exceptions/bid-placement.exception';
import { AuctionDTO } from '../DTOs/auction.dto';
import { Auction } from '../models/auction.model';
import { AuctionDeserializer } from '../deserializers/auction.deserializer';
import { BidCreationData } from '../models/bid-creation-data.model';
import { BidCreationSerializer } from '../serializers/bid-creation.serializer';

export const ActiveBidsCacheBuster$ = new Subject<void>();

@Injectable({
    providedIn: 'root',
})
export class BidService {
    constructor(
        private readonly http: HttpClient,
        private readonly auth: AuthenticationService,
        private readonly deserializer: AuctionDeserializer,
        private readonly serializer: BidCreationSerializer,
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
    public placeBid(bid: BidCreationData): Observable<unknown> {
        return this.http
            .post(`bids/new`, this.serializer.serialize(bid), {
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
        return this.http.get<AuctionDTO[]>(`bids/active`).pipe(
            map((dtos) => this.deserializer.deserializeArray(dtos)),
            catchError(() => of([])),
        );
    }
}
