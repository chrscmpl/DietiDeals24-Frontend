import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { BidCreationDTO } from '../dtos/bid.dto';
import { BidCreationData } from '../models/bid-creation-data.model';
import { AuthorizedPaymentMethodSerializer } from './authorized-payment-method.deserializer';

@Injectable({
    providedIn: 'root',
})
export class BidCreationSerializer
    implements Serializer<BidCreationData, BidCreationDTO>
{
    public constructor(
        private readonly authorizedPaymentMethodSerializer: AuthorizedPaymentMethodSerializer,
    ) {}

    public serialize(bid: BidCreationData): BidCreationDTO {
        if (!bid.paymentMethod.id && !bid.paymentMethod.data)
            throw new Error(
                'BidCreationSerializer: invalid bid payment method',
            );

        const paymentMethodKey: string = bid.paymentMethod.id
            ? 'paymentMethodId'
            : bid.paymentMethod.save
              ? 'paymentMethodToBeSaved'
              : 'OneTimePaymentMethod';

        return {
            auctionId: bid.auctionId,
            bidAmount: bid.amount,
            [paymentMethodKey]:
                bid.paymentMethod.id ??
                this.authorizedPaymentMethodSerializer.serialize(
                    bid.paymentMethod.data!,
                ),
        } as BidCreationDTO;
    }

    public serializeArray(bids: BidCreationData[]): BidCreationDTO[] {
        return bids.map((bid) => this.serialize(bid));
    }
}
