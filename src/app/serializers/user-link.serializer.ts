import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { userLinkCreationDTO } from '../DTOs/user-link.dto';
import { userLinkCreationData } from '../models/user-link.model';

@Injectable({
    providedIn: 'root',
})
export class UserLinkSerializer
    implements Serializer<userLinkCreationData, userLinkCreationDTO>
{
    public serialize(link: userLinkCreationData): userLinkCreationDTO {
        return {
            description: link.name,
            link: link.url,
        };
    }

    public serializeArray(
        dataArr: userLinkCreationData[],
    ): userLinkCreationDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
