import {
    ReverseAuctionDTO,
    ReverseAuctionSummaryDTO,
    SilentAuctionDTO,
    SilentAuctionSummaryDTO,
} from '../../DTOs/auction.dto';
import {
    Auction,
    ReverseAuction,
    SilentAuction,
} from '../../models/auction.model';
import {
    AuctionSummary,
    ReverseAuctionSummary,
    SilentAuctionSummary,
} from '../../models/auction.summary.model';
import { AuctionType } from '../../typeUtils/auction.utils';
import { Builder } from './Builder';

export const auctionSummaryBuilder = new Builder<AuctionSummary>(
    (type: string) => {
        switch (type) {
            case AuctionType.silent:
                return (item: SilentAuctionSummaryDTO) =>
                    new SilentAuctionSummary(item);
            case AuctionType.reverse:
                return (item: ReverseAuctionSummaryDTO) =>
                    new ReverseAuctionSummary(item);
            default:
                throw new Error('Invalid auction summary DTO');
        }
    },
    'type',
);

export const auctionBuilder = new Builder<Auction>((type: string) => {
    switch (type) {
        case AuctionType.silent:
            return (item: SilentAuctionDTO) => new SilentAuction(item);
        case AuctionType.reverse:
            return (item: ReverseAuctionDTO) => new ReverseAuction(item);
        default:
            throw new Error('Invalid auction DTO');
    }
}, 'type');
