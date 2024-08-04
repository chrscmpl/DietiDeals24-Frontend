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
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { Builder } from './builder';

export const auctionBuilder = new Builder<AuctionDTO, Auction>((dto) => {
    switch (dto.type) {
        case AuctionRuleSet.silent:
            return new SilentAuction(dto as SilentAuctionDTO);
        case AuctionRuleSet.reverse:
            return new ReverseAuction(dto as ReverseAuctionDTO);
        default:
            throw new Error('Invalid auction DTO');
    }
});
