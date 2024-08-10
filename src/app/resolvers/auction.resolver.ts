import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { catchError, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Auction } from '../models/auction.model';
import { AuctionsService } from '../services/auctions.service';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AuctionStatus } from '../enums/auction-status.enum';
import { BidService } from '../services/bid.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';

export interface AuctionResolverOptions {
    ownAuction?: boolean;
    requiredStatus?: AuctionStatus;
    hasAlreadyBidded?: boolean;
    includeUser?: boolean;
    includeWinner?: boolean;
    useParent?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuctionResolver {
    constructor(
        private readonly auctionsService: AuctionsService,
        private readonly authenticationService: AuthenticationService,
        private readonly bidService: BidService,
        private readonly messageService: MessageService,
        private readonly userService: UserService,
    ) {}

    public resolve(
        route: ActivatedRouteSnapshot,
        options?: AuctionResolverOptions,
    ): Observable<Auction> {
        const auctionId: string = (
            options?.useParent
                ? (route.parent as ActivatedRouteSnapshot)
                : route
        ).params['auction-id'];

        return this.auctionsService.getDetails(auctionId).pipe(
            take(1),
            tap((auction) => {
                if (options?.ownAuction !== undefined)
                    this.validateOwnAuction(auction, options?.ownAuction);
            }),
            tap((auction) => {
                if (options?.requiredStatus !== undefined)
                    this.validateRequiredStatus(
                        auction,
                        options?.requiredStatus,
                    );
            }),
            switchMap((auction) =>
                (options?.hasAlreadyBidded !== undefined
                    ? this.validateHasAlreadyBidded(
                          auction,
                          options.hasAlreadyBidded,
                      )
                    : of(null)
                ).pipe(map(() => auction)),
            ),
            switchMap((auction) =>
                options?.includeUser
                    ? this.auctionWithUser(auction)
                    : of(auction),
            ),
            switchMap((auction) =>
                options?.includeWinner
                    ? this.auctionWithWinner(auction)
                    : of(auction),
            ),
            catchError((error) => {
                const message: string =
                    error instanceof HttpErrorResponse
                        ? 'We could not find the requested auction'
                        : error.message;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: message ?? 'An error occurred',
                });
                throw error;
            }),
        );
    }

    private validateOwnAuction(auction: Auction, ownAuction: boolean) {
        const user = this.authenticationService.loggedUser;
        if (
            user?.id != undefined &&
            auction.userId != undefined &&
            ownAuction !== (auction.userId === user.id)
        )
            throw new Error(
                `Cannot access this auction because it is ${auction.userId === user.id ? '' : 'not '}yours`,
            );
    }

    private validateRequiredStatus(
        auction: Auction,
        requiredStatus: AuctionStatus,
    ) {
        if (requiredStatus !== auction.status)
            throw new Error(
                `Cannot access this auction because it is of status ${auction.status}`,
            );
    }

    private validateHasAlreadyBidded(
        auction: Auction,
        shouldHaveAlreadyBidded: boolean,
    ): Observable<unknown> {
        return this.bidService.getOwnActiveBids().pipe(
            catchError(() => of([])),
            tap((bids: Auction[]) => {
                const hasAlreadyBidded = !!bids.find(
                    (bid) => bid.id === auction.id,
                );
                if (shouldHaveAlreadyBidded !== hasAlreadyBidded)
                    throw new Error(
                        `Cannot access this auction because it has ${shouldHaveAlreadyBidded ? 'not ' : ''}already been bidden on by the user`,
                    );
            }),
        );
    }

    private auctionWithUser(auction: Auction) {
        return this.userService.getSummary(auction.userId!).pipe(
            tap((user) => (auction.user = user)),
            map(() => auction),
        );
    }

    private auctionWithWinner(auction: Auction) {
        return this.userService.getSummary(auction.winnerId!).pipe(
            tap((winner) => (auction.winner = winner)),
            map(() => auction),
        );
    }

    public static asResolveFn(
        options?: AuctionResolverOptions,
    ): ResolveFn<Auction> {
        return (route) => {
            return inject(AuctionResolver).resolve(route, options);
        };
    }
}
