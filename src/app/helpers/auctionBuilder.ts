import {
    AuctionSummaryDTO,
    ReverseAuctionSummaryDTO,
    SilentAuctionSummaryDTO,
} from '../DTOs/auction.dto';
import {
    AuctionSummary,
    ReverseAuctionSummary,
    SilentAuctionSummary,
} from '../models/auction.model';
import { AuctionType } from '../typeUtils/auction.utils';

export const auctionBuilder = (() => {
    const build = (auction: AuctionSummaryDTO): AuctionSummary => {
        switch (auction.type) {
            case AuctionType.silent:
                return new SilentAuctionSummary(
                    auction as SilentAuctionSummaryDTO,
                );
            case AuctionType.reverse:
                return new ReverseAuctionSummary(
                    auction as ReverseAuctionSummaryDTO,
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
