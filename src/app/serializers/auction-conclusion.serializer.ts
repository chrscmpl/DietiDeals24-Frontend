import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { AuthorizedPaymentMethodSerializer } from './authorized-payment-method.deserializer';
import { AuctionConclusionData } from '../models/auction-conclusion-data.model';
import { AuctionConclusionDTO } from '../DTOs/auction-conclusion.dto';
import { AuthorizedPaymentMethod } from '../models/authorized-payment-method.model';

@Injectable({
    providedIn: 'root',
})
export class AuctionConclusionSerializer
    implements Serializer<AuctionConclusionData, AuctionConclusionDTO>
{
    public constructor(
        private readonly authorizedPaymentMethodSerializer: AuthorizedPaymentMethodSerializer,
    ) {}

    public serialize(
        auctionConclusionData: AuctionConclusionData,
    ): AuctionConclusionDTO {
        if (
            auctionConclusionData.paymentMethod &&
            !auctionConclusionData.paymentMethod.id &&
            !auctionConclusionData.paymentMethod.data
        )
            throw new Error(
                'AuctionConclusionSerializer: invalid auction conclusion payment method',
            );

        const paymentMethod: {
            [key: string]: string | AuthorizedPaymentMethod;
        } = {};

        if (auctionConclusionData.paymentMethod) {
            const paymentMethodKey: string = auctionConclusionData.paymentMethod
                .id
                ? 'paymentMethodId'
                : auctionConclusionData.paymentMethod.save
                  ? 'paymentMethodToBeSaved'
                  : 'OneTimePaymentMethod';

            paymentMethod[paymentMethodKey] =
                auctionConclusionData.paymentMethod.id ??
                this.authorizedPaymentMethodSerializer.serialize(
                    auctionConclusionData.paymentMethod.data!,
                );
        }

        return {
            auctionId: auctionConclusionData.auctionId,
            choice: auctionConclusionData.choice,
            ...paymentMethod,
        } as AuctionConclusionDTO;
    }

    public serializeArray(
        bids: AuctionConclusionData[],
    ): AuctionConclusionDTO[] {
        return bids.map((bid) => this.serialize(bid));
    }
}
