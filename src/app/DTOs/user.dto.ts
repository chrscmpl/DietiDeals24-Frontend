import { UserInterface } from '../models/user.model';

export type UserDTO = Omit<UserInterface, 'profileInformation'>;

export type UserRegistrationDTO = {
    name: string;
    surname: string;
    birthday: string;
    country?: string;
    city?: string;
    username: string;
    email: string;
    password: string;
};

export type emailVerificationDTO = {
    email: string;
    code: string;
};

export interface UserCredentials {
    email: string;
    password: string;
}
