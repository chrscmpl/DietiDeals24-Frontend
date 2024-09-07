import { userLink } from '../models/user.model';

export interface AuthenticatedUserDTO {
    userId: string;
    username: string;
    name: string;
    surname: string;
    birthday: string;
    email: string;
    onlineAuctionsCounter?: number | null;
    pastDealsCounter?: number | null;
    profilePictureUrl?: string | null;
    country?: string | null;
    city?: string | null;
    bio?: string | null;
    links?: userLink[] | null;
}

export type UserSummaryDTO = {
    userId: string;
    username: string;
    profilePictureUrl: string;
    country: string;
    city: string;
};

export type UserRegistrationDTO = {
    name: string;
    surname: string;
    birthday: string;
    country: string;
    city: string;
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
