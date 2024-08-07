import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { Auction } from '../models/auction.model';
import { AuctionDTO } from '../DTOs/auction.dto';
import { environment } from '../../environments/environment';
import { auctionBuilder } from '../helpers/builders/auction-builder';
import { AuctionConclusionDTO } from '../DTOs/auction-conclusion.dto';

export const OwnActiveAuctionsCacheBuster$ = new Subject<void>();

@Injectable({
    providedIn: 'root',
})
export class AuctioneerService {
    constructor(
        private readonly http: HttpClient,
        private readonly auth: AuthenticationService,
    ) {
        this.auth.isLogged$.subscribe(() => {
            OwnActiveAuctionsCacheBuster$.next();
        });
    }

    public refreshOwnActiveAuctions(): void {
        this.getOwnActiveAuctions().subscribe();
    }

    @CacheBuster({
        cacheBusterNotifier: OwnActiveAuctionsCacheBuster$,
    })
    public concludeAuction(
        conclusionOptions: AuctionConclusionDTO,
    ): Observable<unknown> {
        return this.http.post<unknown>(
            `${environment.backendHost}/conclude`,
            conclusionOptions,
        );
    }

    @Cacheable({
        cacheBusterObserver: OwnActiveAuctionsCacheBuster$,
    })
    public getOwnActiveAuctions(): Observable<Auction[]> {
        return this.http
            .get<AuctionDTO[]>(`${environment.backendHost}/auctions/own-active`)
            .pipe(
                map((dtos) => auctionBuilder.buildArray(dtos)),
                catchError(() => of([])),
            );
    }
}
