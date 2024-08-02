import {
    AuctionDTO,
    ReverseAuctionDTO,
    SilentAuctionDTO,
} from '../../DTOs/auction.dto';
import {
    Auction,
    ReverseAuction,
    SilentAuction,
} from '../../models/auction.model';
import { AuctionType } from '../../enums/auctionType.enum';
import { Builder } from './Builder';

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
