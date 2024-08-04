import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Auction } from '../models/auction.model';
import { AuctionsService } from '../services/auctions.service';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class AuctionResolver implements Resolve<Auction> {
    constructor(private auctionsService: AuctionsService) {}

    public resolve(route: ActivatedRouteSnapshot): Observable<Auction> {
        const auctionId: string = route.params['auction-id'];

        return this.auctionsService.getDetails(auctionId).pipe(take(1));
    }
}

export const auctionResolverFn: ResolveFn<Auction> = (route) => {
    return inject(AuctionResolver).resolve(route);
};
