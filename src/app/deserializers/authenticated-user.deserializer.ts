import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import { AuthenticatedUserDTO } from '../DTOs/authentication.dto';
import { AuthenticatedUser } from '../models/authenticated-user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticatedUserDeserializer
    implements Deserializer<AuthenticatedUserDTO, AuthenticatedUser>
{
    public deserialize(dto: AuthenticatedUserDTO): AuthenticatedUser {
        return new AuthenticatedUser(dto);
    }

    public deserializeArray(dtos: AuthenticatedUserDTO[]): AuthenticatedUser[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
