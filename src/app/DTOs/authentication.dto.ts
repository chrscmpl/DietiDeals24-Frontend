import { userLinkDTO } from './user-link.dto';

export interface AuthenticatedUserDTO {
    userId: string;
    username: string;
    name: string;
    surname: string;
    birthday: string;
    email: string;
    onlineAuctionsCounter: number;
    onlineBidsCounter: number;
    pastBidsCounter: number;
    pastAuctionsCounter: number;
    profilePictureUrl?: string | null;
    country?: string | null;
    city?: string | null;
    bio?: string | null;
    personalLinks?: userLinkDTO[] | null;
}

export interface UserRegistrationDTO {
    name: string;
    surname: string;
    birthday: string;
    country: string;
    city: string;
    username: string;
    email: string;
    password: string;
}

export interface emailVerificationDTO {
    email: string;
    code: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}
