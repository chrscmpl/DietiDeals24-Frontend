import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { PasswordChangeData } from '../models/password-change-data.model';
import { PasswordChangeDataDTO } from '../DTOs/password-change.dto';

@Injectable({
    providedIn: 'root',
})
export class PasswordChangeDataSerializer
    implements Serializer<PasswordChangeData, PasswordChangeDataDTO>
{
    public serialize(data: PasswordChangeData): PasswordChangeDataDTO {
        return data;
    }

    public serializeArray(
        dataArr: PasswordChangeData[],
    ): PasswordChangeDataDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
