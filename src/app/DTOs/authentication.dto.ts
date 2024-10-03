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
    country: string;
    city: string;
    bio?: string | null;
    links?: userLinkDTO[] | null;
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

export interface SocialLoginDTO {
    oauthToken: string;
}

export interface SocialRegistrationDTO {
    username: string;
    name: string;
    surname: string;
    birthday: string;
    country: string;
    city: string;
    oauthToken: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}
