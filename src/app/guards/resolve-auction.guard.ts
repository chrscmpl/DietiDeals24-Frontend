import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { Auction } from '../models/auction.model';
import { AuctionsService } from '../services/auctions.service';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class ResolveAuctionGuard implements Resolve<Auction> {
    private cachedAuction: Auction | null = null;

    constructor(private auctionsService: AuctionsService) {}

    public resolve(route: ActivatedRouteSnapshot): Observable<Auction> {
        const auctionId: string = route.params['auction-id'];

        if (this.cachedAuction && this.cachedAuction.id === auctionId)
            return of(this.cachedAuction);

        return this.auctionsService
            .getDetails(auctionId)
            .pipe(tap((auction) => (this.cachedAuction = auction)));
    }
}

export const resolveAuctionGuard: ResolveFn<Auction> = (route) => {
    return inject(ResolveAuctionGuard).resolve(route);
};
