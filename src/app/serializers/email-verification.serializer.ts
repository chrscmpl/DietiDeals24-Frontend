import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { emailVerificationData } from '../models/email-verification-data.model';
import { emailVerificationDTO } from '../DTOs/authentication.dto';

@Injectable({
    providedIn: 'root',
})
export class EmailVerificationSerializer
    implements Serializer<emailVerificationData, emailVerificationDTO>
{
    public serialize(data: emailVerificationData): emailVerificationDTO {
        return data;
    }

    public serializeArray(
        dataArr: emailVerificationData[],
    ): emailVerificationDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
