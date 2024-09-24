import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { AuctionCreationDTO } from '../dtos/auction.dto';
import { AuctionCreationData } from '../models/auction-creation-data.model';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';

@Injectable({
    providedIn: 'root',
})
export class AuctionCreationSerializer
    implements Serializer<AuctionCreationData, AuctionCreationDTO>
{
    public serialize(auction: AuctionCreationData): AuctionCreationDTO {
        if (!auction.category)
            throw new Error('AuctionSerializer: category is required');

        const startingBidKey =
            auction.ruleset === AuctionRuleSet.silent
                ? 'minimumBid'
                : auction.ruleset === AuctionRuleSet.reverse
                  ? 'maximumBid'
                  : 'startingBid';

        return {
            auctionType: auction.ruleset,
            itemCategory: auction.category,
            itemName: auction.details.title,
            itemCondition: auction.details.conditions,
            description: auction.details.description,
            country: auction.details.country,
            city: auction.details.city,
            currency: auction.details.currency,
            endTime: `${
                new Date(
                    auction.details.endTime.getTime() -
                        auction.details.endTime.getTimezoneOffset() * 60000,
                )
                    .toISOString()
                    .split('.')[0]
            }Z`,
            picturesUrls: auction.pictures.map((picture) => picture.url),
            [startingBidKey]: auction.details.startingBid,
        };
    }

    public serializeArray(
        auctions: AuctionCreationData[],
    ): AuctionCreationDTO[] {
        return auctions.map((auction) => this.serialize(auction));
    }
}
