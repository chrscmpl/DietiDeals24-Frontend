import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { ResetForgottenPasswordData } from '../models/reset-forgotten-password-data.model';
import { ResetForgottenPasswordDTO } from '../DTOs/reset-forgotten-password-data.dto';

@Injectable({
    providedIn: 'root',
})
export class ResetForgottenPasswordDataSerializer
    implements
        Serializer<ResetForgottenPasswordData, ResetForgottenPasswordDTO>
{
    public serialize(
        data: ResetForgottenPasswordData,
    ): ResetForgottenPasswordDTO {
        return {
            userId: data.userId,
            authToken: data.token,
            newPassword: data.newPassword,
        };
    }

    public serializeArray(
        dataArr: ResetForgottenPasswordData[],
    ): ResetForgottenPasswordDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
