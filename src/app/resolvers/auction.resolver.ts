import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { Auction } from '../models/auction.model';
import { AuctionsService } from '../services/auctions.service';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticatedUser } from '../models/user.model';

@Injectable()
export class AuctionResolver implements Resolve<Auction> {
    constructor(private auctionsService: AuctionsService) {}

    public resolve(route: ActivatedRouteSnapshot): Observable<Auction> {
        const auctionId: string = route.params['auction-id'];

        return this.auctionsService.getDetails(auctionId).pipe(take(1));
    }
}

export function getAuctionResolverFn(options?: {
    ownAuction?: boolean;
    fromParent?: boolean;
}): ResolveFn<Auction> {
    const validationCallback =
        options?.ownAuction === undefined
            ? () => {}
            : (auction: Auction, user: AuthenticatedUser | null) => {
                  console.log(auction.id, auction.userId, !!user, user?.id);
                  if (
                      !user?.id ||
                      !auction.userId ||
                      options.ownAuction === (auction.userId === user.id)
                  )
                      return;
                  throw new Error('Cannot access this auction');
              };
    return (route) => {
        const user =
            options?.ownAuction === undefined
                ? null
                : inject(AuthenticationService).loggedUser;
        return inject(AuctionResolver)
            .resolve(
                options?.fromParent
                    ? (route.parent as ActivatedRouteSnapshot)
                    : route,
            )
            .pipe(tap((auction) => validationCallback(auction, user)));
    };
}
