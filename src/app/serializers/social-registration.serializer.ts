import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { SocialRegistrationDTO } from '../dtos/authentication.dto';
import { SocialRegistrationData } from '../models/social-registration.model';
import { omit } from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class SocialRegistrationSerializer
    implements Serializer<SocialRegistrationData, SocialRegistrationDTO>
{
    public serialize(data: SocialRegistrationData): SocialRegistrationDTO {
        return {
            ...omit(data, ['socialUser', 'birthday']),
            oauthToken: data.socialUser.idToken,
            birthday:
                new Date(
                    data.birthday.getTime() -
                        data.birthday.getTimezoneOffset() * 60000,
                )
                    .toISOString()
                    .split('.')[0] + 'Z',
        };
    }

    public serializeArray(
        dataArr: SocialRegistrationData[],
    ): SocialRegistrationDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
