import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bid } from '../models/bid.model';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { BidCreationDTO, BidDTO } from '../DTOs/bid.dto';
import { environment } from '../../environments/environment';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AuthenticationService } from './authentication.service';

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
    public createBid(bid: BidCreationDTO): Observable<unknown> {
        return this.http.post<unknown>(`${environment.backendHost}/bids`, bid);
    }

    @Cacheable({
        cacheBusterObserver: ActiveBidsCacheBuster$,
    })
    public getOwnActiveBids(): Observable<Bid[]> {
        return this.http
            .get<BidDTO[]>(`${environment.backendHost}/bids/active`)
            .pipe(
                map((dtos) => dtos.map((bidDTO) => new Bid(bidDTO))),
                catchError(() => of([])),
            );
    }
}
