import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CacheBuster } from 'ts-cacheable';
import { BidPlacementException } from '../exceptions/bid-placement.exception';
import { BidCreationData } from '../models/bid-creation-data.model';
import { BidCreationSerializer } from '../serializers/bid-creation.serializer';
import { cacheBusters } from '../helpers/cache-busters.helper';

@Injectable({
    providedIn: 'root',
})
export class BidService {
    constructor(
        private readonly http: HttpClient,
        private readonly serializer: BidCreationSerializer,
    ) {}

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.activeBids$,
    })
    public placeBid(bid: BidCreationData): Observable<unknown> {
        return this.http
            .post('bids/new', this.serializer.serialize(bid), {
                responseType: 'text',
            })
            .pipe(
                catchError((e) =>
                    throwError(() => new BidPlacementException(e)),
                ),
            );
    }
}
