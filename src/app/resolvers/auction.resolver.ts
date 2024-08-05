import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { catchError, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Auction } from '../models/auction.model';
import { AuctionsService } from '../services/auctions.service';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticatedUser } from '../models/user.model';
import { AuctionStatus } from '../enums/auction-status.enum';
import { BidService } from '../services/bid.service';
import { Bid } from '../models/bid.model';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuctionResolver implements Resolve<Auction> {
    constructor(private auctionsService: AuctionsService) {}

    public resolve(route: ActivatedRouteSnapshot): Observable<Auction> {
        const auctionId: string = route.params['auction-id'];

        return this.auctionsService.getDetails(auctionId).pipe(take(1));
    }
}

function getIsOwnAuctionValitationCallback(ownAuction?: boolean) {
    return ownAuction === undefined
        ? () => {}
        : (auction: Auction, user: AuthenticatedUser | null) => {
              if (
                  ownAuction != undefined &&
                  user?.id != undefined &&
                  auction.userId != undefined &&
                  ownAuction !== (auction.userId === user.id)
              )
                  throw new Error(
                      `Cannot access this auction because it is ${auction.userId === user.id ? '' : 'not '}yours`,
                  );
              return;
          };
}

function getIsAuctionActiveValidationCallback(isAuctionActive?: boolean) {
    return isAuctionActive === undefined
        ? () => {}
        : (auction: Auction) => {
              if (
                  isAuctionActive != undefined &&
                  isAuctionActive !== (auction.status === AuctionStatus.active)
              )
                  throw new Error(
                      `Cannot access this auction because it is ${auction.userId === AuctionStatus.active ? '' : 'not '}active`,
                  );
              return;
          };
}

function getHasAlradyBiddedValidationCallback(
    hasAlreadyBidded?: boolean,
): (a: Auction, b: BidService) => Observable<Auction> {
    return hasAlreadyBidded === undefined
        ? (auction: Auction) => of(auction)
        : (auction: Auction, bidService: BidService) => {
              return bidService.getOwnActiveBids().pipe(
                  tap((bids: Bid[]) => {
                      if (bids.find((bid) => bid.auctionId === auction.id))
                          throw new Error(
                              'Cannot access this auction because it has already been bidden on by the user',
                          );
                  }),
                  map(() => auction),
              );
          };
}

export function getAuctionResolverFn(options?: {
    ownAuction?: boolean;
    isAuctionActive?: boolean;
    hasAlreadyBidded?: boolean;
    useParent?: boolean;
}): ResolveFn<Auction> {
    const isOwnAuctionValidationCallback = getIsOwnAuctionValitationCallback(
        options?.ownAuction,
    );
    const isAuctionActiveValidationCallback =
        getIsAuctionActiveValidationCallback(options?.isAuctionActive);
    const hasAlreadyBiddedValidationCallback =
        getHasAlradyBiddedValidationCallback(options?.hasAlreadyBidded);

    return (route) => {
        const user = inject(AuthenticationService).loggedUser;
        const bidService = inject(BidService);
        const messageService = inject(MessageService);

        return inject(AuctionResolver)
            .resolve(
                options?.useParent
                    ? (route.parent as ActivatedRouteSnapshot)
                    : route,
            )
            .pipe(
                tap((auction) => isOwnAuctionValidationCallback(auction, user)),
                tap((auction) => isAuctionActiveValidationCallback(auction)),
                switchMap((auction) =>
                    hasAlreadyBiddedValidationCallback(auction, bidService),
                ),
                catchError((error) => {
                    messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message,
                    });
                    throw error;
                }),
            );
    };
}
