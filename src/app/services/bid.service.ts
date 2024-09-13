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
import { CacheBustersService } from './cache-busters.service';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { Auction } from '../models/auction.model';
import { AuthenticationService } from './authentication.service';

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
        maxCacheCount: 16,
        cacheBusterObserver: CacheBustersService.CACHE_BUSTERS.activeBids$,
    })
    public hasAlreadyBidded(auction: Auction): Observable<boolean> {
        return this.authentication.isLogged$.pipe(
            take(1),
            switchMap((isLogged) => {
                if (!isLogged) return of(false);

                return this.getOwnBidsForAuction(auction.id).pipe(
                    map(
                        (bids) =>
                            !!(
                                bids.length &&
                                (auction.ruleset === AuctionRuleSet.silent ||
                                    bids[bids.length - 1].bidAmount ===
                                        auction.lastBid)
                            ),
                    ),
                );
            }),
            catchError(() => of(false)),
        );
    }

    private getOwnBidsForAuction(
        id: string,
    ): Observable<{ bidAmount: number }[]> {
        return this.http.get<{ bidAmount: number }[]>(`bids/own/by-auction`, {
            params: { auctionId: id },
        });
    }
}
