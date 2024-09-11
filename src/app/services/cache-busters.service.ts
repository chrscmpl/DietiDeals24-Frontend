import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AuctionsService } from './auctions.service';

class CacheBusters {
    public readonly activeBids$ = new Subject<void>();

    public readonly ownActiveAuctions$ = new Subject<void>();

    public readonly paymentMethods$ = new Subject<void>();
}

@Injectable({
    providedIn: 'root',
})
export class CacheBustersService {
    public static readonly CACHE_BUSTERS = new CacheBusters();

    constructor(
        private readonly authentication: AuthenticationService,
        private readonly auctionsService: AuctionsService,
    ) {
        this.authentication.isLogged$.subscribe(() => {
            CacheBustersService.CACHE_BUSTERS.activeBids$.next();
            CacheBustersService.CACHE_BUSTERS.ownActiveAuctions$.next();
        });

        merge(
            this.authentication.isLogged$,
            CacheBustersService.CACHE_BUSTERS.activeBids$,
            CacheBustersService.CACHE_BUSTERS.ownActiveAuctions$,
        ).subscribe(() => {
            CacheBustersService.CACHE_BUSTERS.paymentMethods$.next();
        });

        CacheBustersService.CACHE_BUSTERS.activeBids$.subscribe(() => {
            this.auctionsService.removeOn(
                (request) => request.ownAuctions && !request.onlyAuctions,
            );
        });

        CacheBustersService.CACHE_BUSTERS.ownActiveAuctions$.subscribe(() => {
            this.auctionsService.removeOn(
                (request) => request.ownAuctions && !request.onlyBids,
            );
        });
    }
}
