import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Auction } from '../models/auction.model';
import { CurrencyPipe } from '@angular/common';
import { map, Observable, of, take } from 'rxjs';

@Pipe({
    name: 'auctionStatusDescription',
    standalone: true,
})
export class AuctionStatusDescriptionPipe implements PipeTransform {
    private readonly currencyPipe: CurrencyPipe;
    public constructor(
        @Inject(LOCALE_ID) public readonly locale: string,
        private readonly authentication: AuthenticationService,
    ) {
        this.currencyPipe = new CurrencyPipe(locale);
    }

    public transform(auction: Auction): Observable<string> {
        if (auction.status === Auction.STATUSES.active)
            return of(this.transformActive(auction));
        else if (auction.status === Auction.STATUSES.pending)
            return of(this.transformPending(auction));

        return this.authentication.initialized$.pipe(
            map(() => {
                if (auction.status === Auction.STATUSES.accepted)
                    return this.transformAccepted(
                        auction,
                        this.authentication.loggedUser?.id ?? null,
                    );
                else if (auction.status === Auction.STATUSES.rejected)
                    return this.transformRejected(
                        auction,
                        this.authentication.loggedUser?.id ?? null,
                    );

                if (auction.status === Auction.STATUSES.aborted)
                    return this.transformAborted(auction);

                return '';
            }),

            take(1),
        );
    }

    private transformActive(auction: Auction): string {
        if (auction.ownBid !== null)
            return `your bid: ${this.transformBidAmount(auction.ownBid, auction.currency)}`;

        return `${auction.lastBidDescription}: ${this.transformBidAmount(auction.lastBid, auction.currency)}`;
    }

    private transformPending(auction: Auction): string {
        if (auction.ownBid && auction.ownBid === auction.winningBid)
            return `your bid of ${this.transformBidAmount(auction.ownBid, auction.currency)} won`;

        return `winning bid: ${this.transformBidAmount(auction.winningBid, auction.currency)}${auction.winnerUsername ? ` by ${auction.winnerUsername}` : ''}`;
    }

    private transformAccepted(
        auction: Auction,
        loggedUserId?: string | null,
    ): string {
        return this.transformAcceptedOrRejected(
            auction,
            'accepted',
            loggedUserId,
        );
    }

    private transformRejected(
        auction: Auction,
        loggedUserId?: string | null,
    ): string {
        return this.transformAcceptedOrRejected(
            auction,
            'rejected',
            loggedUserId,
        );
    }

    private transformAcceptedOrRejected(
        auction: Auction,
        status: 'accepted' | 'rejected',
        loggedUserId?: string | null,
    ): string {
        if (loggedUserId !== null && loggedUserId === auction.userId)
            return `You ${status} this bid: ${this.transformBidAmount(auction.lastBid, auction.currency)}${auction.winnerUsername ? ` by ${auction.winnerUsername}` : ''}`;
        else if (loggedUserId !== null && loggedUserId === auction.lastBidderId)
            return `Your bid of ${this.transformBidAmount(auction.lastBid, auction.currency)} was ${status}${auction.ownerUsername ? ` by ${auction.ownerUsername}` : ''}`;
        else if (auction.ownerUsername) {
            return `${auction.ownerUsername} ${status} a bid of ${this.transformBidAmount(auction.lastBid, auction.currency)}${auction.winnerUsername ? ` by ${auction.winnerUsername}` : ''}`;
        }

        return `${status} bid: ${this.transformBidAmount(auction.lastBid, auction.currency)}${auction.winnerUsername ? ` by ${auction.winnerUsername}` : ''}`;
    }

    private transformAborted(auction: Auction): string {
        return `This auction was canceled by ${auction.ownerUsername ? ` by ${auction.ownerUsername}` : 'its owner'}`;
    }

    private transformBidAmount(
        amount: number | null,
        currency: string,
    ): string {
        return `<span class="auction-bid-amount">${this.currencyPipe.transform(amount, currency)}</span>`;
    }
}
