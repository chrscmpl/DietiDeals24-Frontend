import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    catchError,
    map,
    Observable,
    of,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { BidPlacementException } from '../exceptions/bid-placement.exception';
import { BidCreationData } from '../models/bid-creation-data.model';
import { BidCreationSerializer } from '../serializers/bid-creation.serializer';
import { AuthenticationService } from './authentication.service';
import { cacheBusters } from '../helpers/cache-busters';

@Injectable({
    providedIn: 'root',
})
export class BidService {
    constructor(
        private readonly http: HttpClient,
        private readonly serializer: BidCreationSerializer,
        private readonly authentication: AuthenticationService,
    ) {}

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.activeBids$,
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
        maxCacheCount: 16,
        cacheBusterObserver: cacheBusters.activeBids$,
    })
    public getOwnBidForAuction(id: string): Observable<number | null> {
        return this.authentication.isLogged$.pipe(
            switchMap((isLogged) => {
                if (!isLogged) return of(null);
                return this.http
                    .get<{ bidAmount: number }[]>(`bids/own/by-auction`, {
                        params: { auctionId: id },
                    })
                    .pipe(
                        map((bids) =>
                            bids.length
                                ? bids[bids.length - 1].bidAmount
                                : null,
                        ),
                    );
            }),
            catchError(() => of(null)),
            take(1),
        );
    }
}
