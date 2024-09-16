import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { RequestForgottenPasswordEmailDTO } from '../DTOs/request-forgotten-password-email.dto';
import { RequestForgottenPasswordEmailData } from '../models/request-forgotten-password-email-data.model';

@Injectable({
    providedIn: 'root',
})
export class RequestForgottenPasswordEmailSerializer
    implements
        Serializer<
            RequestForgottenPasswordEmailData,
            RequestForgottenPasswordEmailDTO
        >
{
    public serialize(
        data: RequestForgottenPasswordEmailData,
    ): RequestForgottenPasswordEmailDTO {
        return data;
    }

    public serializeArray(
        dataArr: RequestForgottenPasswordEmailData[],
    ): RequestForgottenPasswordEmailDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
