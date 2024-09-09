import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { AuctionCreationDTO } from '../DTOs/auction.dto';
import { isNil, omit, omitBy } from 'lodash-es';
import { AuctionCreationData } from '../models/auction-creation-data.model';

@Injectable({
    providedIn: 'root',
})
export class AuctionCreationSerializer
    implements Serializer<AuctionCreationData, AuctionCreationDTO>
{
    public serialize(auction: AuctionCreationData): AuctionCreationDTO {
        if (!auction.category)
            throw new Error('AuctionSerializer: category is required');

        return omitBy(
            {
                endTime: `${
                    new Date(
                        auction.details.endTime.getTime() -
                            auction.details.endTime.getTimezoneOffset() * 60000,
                    )
                        .toISOString()
                        .split('.')[0]
                }Z`,
                ...omit(auction.details, ['endTime']),
                ...omit(auction, ['details', 'pictures']),
                pictures: auction.pictures.map((picture) => picture.url),
            } as AuctionCreationDTO,
            isNil,
        ) as AuctionCreationDTO;
    }

    public serializeArray(
        auctions: AuctionCreationData[],
    ): AuctionCreationDTO[] {
        return auctions.map((auction) => this.serialize(auction));
    }
}
