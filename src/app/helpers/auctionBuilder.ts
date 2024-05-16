import {
    AuctionSummary,
    AuctionSummaryDTO,
    AuctionType,
    ReverseAuctionSummary,
    SilentAuctionSummary,
} from '../models/auction.model';
import { Money } from '../models/money.model';

export const auctionBuilder = (() => {
    const build = (auction: AuctionSummaryDTO): AuctionSummary => {
        switch (auction.type) {
            case AuctionType.silent:
                return new SilentAuctionSummary(
                    auction as AuctionSummaryDTO & {
                        minimumBid: Money;
                    },
                );
            case AuctionType.reverse:
                return new ReverseAuctionSummary(
                    auction as AuctionSummaryDTO & {
                        maximumStartingBid: Money;
                        lowestBid: Money;
                    },
                );
            default:
                throw new Error('Invalid auction DTO');
        }
    };
    return {
        buildSingle(auction: AuctionSummaryDTO): AuctionSummary {
            return build(auction);
        },
        buildArray(auctions: AuctionSummaryDTO[]): AuctionSummary[] {
            return auctions.map((auction) => build(auction));
        },
    };
})();
