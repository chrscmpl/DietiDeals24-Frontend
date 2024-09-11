import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AuthenticationService } from './authentication.service';
import { BidPlacementException } from '../exceptions/bid-placement.exception';
import { AuctionDTO } from '../DTOs/auction.dto';
import { Auction } from '../models/auction.model';
import { AuctionDeserializer } from '../deserializers/auction.deserializer';
import { BidCreationData } from '../models/bid-creation-data.model';
import { BidCreationSerializer } from '../serializers/bid-creation.serializer';
import { CacheBustersService } from './cache-busters.service';

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
        this.auth.isLogged$.pipe(delay(100)).subscribe((isLogged) => {
            if (isLogged) {
                this.refreshOwnActiveBids();
            }
        });
    }

    public refreshOwnActiveBids(): void {
        this.getOwnActiveBids().subscribe();
    }

    @CacheBuster({
        cacheBusterNotifier: CacheBustersService.CACHE_BUSTERS.activeBids$,
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
        cacheBusterObserver: CacheBustersService.CACHE_BUSTERS.activeBids$,
    })
    public getOwnActiveBids(): Observable<Auction[]> {
        return this.http.get<AuctionDTO[]>(`bids/active`).pipe(
            map((dtos) => this.deserializer.deserializeArray(dtos)),
            catchError(() => of([])),
        );
    }
}
