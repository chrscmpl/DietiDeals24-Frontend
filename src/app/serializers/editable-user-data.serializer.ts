import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { editableUserData } from '../models/editable-user-data.model';
import { editableUserDataDTO } from '../dtos/editable-user-data.dto';
import { omitBy } from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class EditableUserDataSerializer
    implements Serializer<editableUserData, editableUserDataDTO>
{
    public serialize(data: editableUserData): editableUserDataDTO {
        return omitBy(
            {
                newUsername: data.username,
                newCountry: data.country,
                newCity: data.city,
                newBio: data.bio,
                newProfilePictureUrl: data.profilePictureUrl,
            },
            (value) => value === undefined,
        );
    }

    public serializeArray(dataArr: editableUserData[]): editableUserDataDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
