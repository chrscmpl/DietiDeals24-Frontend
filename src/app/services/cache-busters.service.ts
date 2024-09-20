import { Injectable } from '@angular/core';
import { merge } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AuctionsService } from './auctions.service';
import { cacheBusters } from '../helpers/cache-busters';

@Injectable({
    providedIn: 'root',
})
export class CacheBustersService {
    constructor(
        private readonly authentication: AuthenticationService,
        private readonly auctionsService: AuctionsService,
    ) {
        this.authentication.isLogged$.subscribe(() => {
            cacheBusters.activeBids$.next();
            cacheBusters.ownActiveAuctions$.next();
        });

        merge(
            this.authentication.isLogged$,
            cacheBusters.activeBids$,
            cacheBusters.ownActiveAuctions$,
        ).subscribe(() => {
            cacheBusters.authenticatedUserData$.next();
        });

        cacheBusters.authenticatedUserData$.subscribe(() => {
            cacheBusters.paymentMethods$.next();
        });

        cacheBusters.activeBids$.subscribe(() => {
            this.auctionsService.resetOn(
                (request) => request.ownAuctions && !request.onlyAuctions,
            );
        });

        cacheBusters.ownActiveAuctions$.subscribe(() => {
            this.auctionsService.resetOn(
                (request) => request.ownAuctions && !request.onlyBids,
            );
        });
    }
}
