import { Location } from './location.model';

export interface User {
    username: string;
    name: string;
    surname: string;
    birthday: string;
    profilePictureUrl: string;
    location?: Location;
    bio: string;
    links: link[];
    onlineAuctions: number;
    pastDeals: number;
    contactData: contactData[];
}

export type UserSummary = Pick<User, 'username' | 'location'>;

export interface UserCredentials {
    email: string;
    password: string;
}

interface link {
    name: string;
    url: string;
}

export interface contactData {
    email?: string;
    phone?: string;
}
