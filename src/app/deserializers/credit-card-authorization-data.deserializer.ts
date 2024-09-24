import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import { CreditCardAuthorizationDataDTO } from '../dtos/payment-method.dto';
import { CreditCardAuthorizationData } from '../models/credit-card-authorization-data.model';

@Injectable({
    providedIn: 'root',
})
export class CreditCardAuthorizationDataDeserializer
    implements
        Deserializer<
            CreditCardAuthorizationDataDTO,
            CreditCardAuthorizationData
        >
{
    public deserialize(
        dto: CreditCardAuthorizationDataDTO,
    ): CreditCardAuthorizationData {
        return new CreditCardAuthorizationData(dto.token);
    }

    public deserializeArray(
        dtos: CreditCardAuthorizationDataDTO[],
    ): CreditCardAuthorizationData[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
