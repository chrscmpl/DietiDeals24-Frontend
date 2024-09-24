import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import { User } from '../models/user.model';
import { UserDTO } from '../dtos/user.dto';

@Injectable({
    providedIn: 'root',
})
export class UserDeserializer implements Deserializer<UserDTO, User> {
    public deserialize(dto: UserDTO): User {
        return new User(dto);
    }

    public deserializeArray(dtos: UserDTO[]): User[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
