import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import { UserSummary } from '../models/user.model';
import { UserSummaryDTO } from '../dtos/user.dto';

@Injectable({
    providedIn: 'root',
})
export class UserSummaryDeserializer
    implements Deserializer<UserSummaryDTO, UserSummary>
{
    public deserialize(dto: UserSummaryDTO): UserSummary {
        return new UserSummary(dto);
    }

    public deserializeArray(dtos: UserSummaryDTO[]): UserSummary[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
