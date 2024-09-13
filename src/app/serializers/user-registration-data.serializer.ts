import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { UserRegistrationData } from '../models/user-registration-data.model';
import { defaults } from 'lodash-es';
import { UserRegistrationDTO } from '../DTOs/authentication.dto';

@Injectable({
    providedIn: 'root',
})
export class UserRegistrationSerializer
    implements Serializer<UserRegistrationData, UserRegistrationDTO>
{
    public serialize(user: UserRegistrationData): UserRegistrationDTO {
        return defaults(
            {
                birthday:
                    new Date(
                        user.birthday.getTime() -
                            user.birthday.getTimezoneOffset() * 60000,
                    )
                        .toISOString()
                        .split('.')[0] + 'Z',
            },
            user,
        );
    }

    public serializeArray(
        users: UserRegistrationData[],
    ): UserRegistrationDTO[] {
        return users.map((user) => this.serialize(user));
    }
}
