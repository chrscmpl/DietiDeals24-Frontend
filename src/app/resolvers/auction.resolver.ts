import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
    catchError,
    forkJoin,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
} from 'rxjs';
import { Auction } from '../models/auction.model';
import { AuctionsService } from '../services/auctions.service';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AuctionStatus } from '../enums/auction-status.enum';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { GetUserException } from '../exceptions/get-user.exception';
import { UserSummary } from '../models/user.model';

export interface AuctionResolverOptions {
    isWinnerOrOwner?: boolean;
    ownAuction?: boolean;
    requiredStatus?: AuctionStatus;
    hasAlreadyBidded?: boolean;
    includeUser?: boolean;
    includeWinner?: boolean;
    includeWinnerIfPresent?: boolean;
    useParent?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuctionResolver {
    constructor(
        private readonly auctionsService: AuctionsService,
        private readonly authenticationService: AuthenticationService,
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
                if (options?.isWinnerOrOwner !== undefined)
                    this.validateIsWinnerOrOwner(
                        auction,
                        options?.isWinnerOrOwner,
                    );
            }),
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
            tap((auction) => {
                if (options?.hasAlreadyBidded !== undefined)
                    this.validateHasAlreadyBidded(
                        auction,
                        options.hasAlreadyBidded,
                    );
            }),
            switchMap((auction) =>
                forkJoin([
                    options?.includeUser
                        ? this.auctionOwner(auction)
                        : of(null),
                    options?.includeWinner ||
                    (options?.includeWinnerIfPresent &&
                        auction.isOver &&
                        auction.winnerId)
                        ? this.auctionWinner(auction)
                        : of(null),
                ]).pipe(
                    map(([user, winner]) => {
                        if (user) auction.user = user;
                        if (winner) auction.lastBidder = winner;
                        return auction;
                    }),
                ),
            ),
            catchError((error) => {
                const message: string =
                    error instanceof GetUserException
                        ? 'Could not fetch the data of an user associated with this auction'
                        : error instanceof HttpErrorResponse
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

    private validateIsWinnerOrOwner(
        auction: Auction,
        isWinnerOrOwner: boolean,
    ) {
        const user = this.authenticationService.loggedUser;
        if (
            user?.id === undefined ||
            isWinnerOrOwner !==
                (auction.userId === user.id || auction.winnerId === user.id)
        )
            throw new Error(
                'Cannot access this auction because it is not in your past deals',
            );
    }

    private validateOwnAuction(auction: Auction, ownAuction: boolean) {
        const user = this.authenticationService.loggedUser;
        if (
            user?.id === undefined ||
            auction.userId === undefined ||
            ownAuction !== (auction.userId === user.id)
        )
            throw new Error(
                `Cannot access this auction because it is ${user?.id && auction.userId === user.id ? '' : 'not '}yours`,
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
    ) {
        if (shouldHaveAlreadyBidded === auction.canBeBiddenOn())
            throw new Error(
                `Cannot access this auction because it has ${shouldHaveAlreadyBidded ? 'not ' : ''}already been bidden on by the user`,
            );
    }

    private auctionOwner(auction: Auction): Observable<UserSummary> {
        if (!auction.userId) throw new Error('Auction has no owner');
        return this.userService.getSummary(auction.userId);
    }

    private auctionWinner(auction: Auction): Observable<UserSummary> {
        if (!auction.winnerId) throw new Error('Auction has no winner');
        return this.userService.getSummary(auction.winnerId);
    }

    public static asResolveFn(
        options?: AuctionResolverOptions,
    ): ResolveFn<Auction> {
        return (route) => {
            return inject(AuctionResolver).resolve(route, options);
        };
    }
}
