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

function getAccessValidatorCallback(options?: {
    ownAuction?: boolean;
    fromParent?: boolean;
}) {
    return options?.ownAuction === undefined
        ? () => {}
        : (auction: Auction, user: AuthenticatedUser | null) => {
              if (
                  user?.id == undefined ||
                  auction.userId == undefined ||
                  options.ownAuction === (auction.userId === user.id)
              )
                  return;
              throw new Error('Cannot access this auction');
          };
}

export function getAuctionResolverFn(options?: {
    ownAuction?: boolean;
    fromParent?: boolean;
}): ResolveFn<Auction> {
    const accessValidatorCallback = getAccessValidatorCallback(options);

    return (route) => {
        const user = inject(AuthenticationService).loggedUser;

        return inject(AuctionResolver)
            .resolve(
                options?.fromParent
                    ? (route.parent as ActivatedRouteSnapshot)
                    : route,
            )
            .pipe(tap((auction) => accessValidatorCallback(auction, user)));
    };
}
