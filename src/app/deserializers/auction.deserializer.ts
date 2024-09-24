import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import {
    Auction,
    ReverseAuction,
    SilentAuction,
} from '../models/auction.model';
import {
    AuctionDTO,
    ReverseAuctionDTO,
    SilentAuctionDTO,
} from '../dtos/auction.dto';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';

@Injectable({
    providedIn: 'root',
})
export class AuctionDeserializer implements Deserializer<AuctionDTO, Auction> {
    public deserialize(dto: AuctionDTO): Auction {
        switch (dto.type) {
            case AuctionRuleSet.silent:
                return new SilentAuction(dto as SilentAuctionDTO);
            case AuctionRuleSet.reverse:
                return new ReverseAuction(dto as ReverseAuctionDTO);
            default:
                throw new Error('Invalid auction DTO');
        }
    }

    public deserializeArray(dtos: AuctionDTO[]): Auction[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
