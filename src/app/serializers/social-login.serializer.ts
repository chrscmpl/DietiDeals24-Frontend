import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { SocialLoginDTO } from '../dtos/authentication.dto';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
    providedIn: 'root',
})
export class SocialLoginSerializer
    implements Serializer<SocialUser, SocialLoginDTO>
{
    public serialize(data: SocialUser): SocialLoginDTO {
        return {
            oauthToken: data.idToken,
        };
    }

    public serializeArray(dataArr: SocialUser[]): SocialLoginDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
