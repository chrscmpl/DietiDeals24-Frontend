import {
    Auction,
    AuctionDTO,
    AuctionType,
    ReverseAuction,
    SilentAuction,
} from '../models/auction.model';
import { Money } from '../models/money.model';

export const auctionBuilder = (() => {
    const build = (auction: AuctionDTO): Auction => {
        switch (auction.auctionType) {
            case AuctionType.silent:
                return new SilentAuction(
                    auction as AuctionDTO & {
                        minimumBid: Money;
                    },
                );
            case AuctionType.reverse:
                return new ReverseAuction(
                    auction as AuctionDTO & {
                        maximumStartingBid: Money;
                        lowestBid: Money;
                    },
                );
            default:
                throw new Error('Invalid auction DTO');
        }
    };
    return {
        buildSingle(auction: AuctionDTO): Auction {
            return build(auction);
        },
        buildArray(auctions: AuctionDTO[]): Auction[] {
            return auctions.map((auction) => build(auction));
        },
    };
})();
