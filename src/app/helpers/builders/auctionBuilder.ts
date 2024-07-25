import {
    AuctionDTO,
    AuctionSummaryDTO,
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

export const auctionSummaryBuilder = new Builder<
    AuctionSummaryDTO,
    AuctionSummary
>((dto) => {
    switch (dto.type) {
        case AuctionType.silent:
            return new SilentAuctionSummary(dto as SilentAuctionSummaryDTO);
        case AuctionType.reverse:
            return new ReverseAuctionSummary(dto as ReverseAuctionSummaryDTO);
        default:
            throw new Error('Invalid auction summary DTO');
    }
});

export const auctionBuilder = new Builder<AuctionDTO, Auction>((dto) => {
    switch (dto.type) {
        case AuctionType.silent:
            return new SilentAuction(dto as SilentAuctionDTO);
        case AuctionType.reverse:
            return new ReverseAuction(dto as ReverseAuctionDTO);
        default:
            throw new Error('Invalid auction DTO');
    }
});
