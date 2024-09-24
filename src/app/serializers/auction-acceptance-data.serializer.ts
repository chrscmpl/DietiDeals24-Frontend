import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { AuthorizedPaymentMethodSerializer } from './authorized-payment-method.deserializer';
import { AuctionAcceptanceData } from '../models/auction-acceptance-data.model';
import { AuctionAcceptanceDataDTO } from '../dtos/auction-acceptance-data.dto';
import { AuthorizedPaymentMethod } from '../models/authorized-payment-method.model';

@Injectable({
    providedIn: 'root',
})
export class AuctionAcceptanceDataSerializer
    implements Serializer<AuctionAcceptanceData, AuctionAcceptanceDataDTO>
{
    public constructor(
        private readonly authorizedPaymentMethodSerializer: AuthorizedPaymentMethodSerializer,
    ) {}

    public serialize(
        auctionConclusionData: AuctionAcceptanceData,
    ): AuctionAcceptanceDataDTO {
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
            ...paymentMethod,
        } as AuctionAcceptanceDataDTO;
    }

    public serializeArray(
        bids: AuctionAcceptanceData[],
    ): AuctionAcceptanceDataDTO[] {
        return bids.map((bid) => this.serialize(bid));
    }
}
