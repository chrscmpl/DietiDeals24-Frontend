import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { AuthenticationService } from './authentication.service';

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

    constructor(private readonly authentication: AuthenticationService) {
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
    }
}
