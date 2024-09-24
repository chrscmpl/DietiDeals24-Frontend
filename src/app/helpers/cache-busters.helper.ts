import { Subject } from 'rxjs';

class CacheBusters {
    public readonly authenticatedUserData$ = new Subject<void>();

    public readonly auctionDetails$ = new Subject<void>();

    public readonly activeBids$ = new Subject<void>();

    public readonly ownActiveAuctions$ = new Subject<void>();

    public readonly paymentMethods$ = new Subject<void>();
}

export const cacheBusters = new CacheBusters();
