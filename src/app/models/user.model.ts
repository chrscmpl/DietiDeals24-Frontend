import { link } from '../helpers/links';
import { Location } from './location.model';

export interface UserInterface {
    email: string;
    username: string;
    profilePictureUrl: string | null;
    unreadNotifications: number;
    profileInformation: {
        name: string;
        surname: string;
        birthday: Date;
        location: Location | null;
        bio: string | null;
        links: link[];
        onlineAuctions: number;
        pastDeals: number;
        contactData: contactData[];
    } | null;
}

export class User implements UserInterface {
    email: string;
    username: string;
    profilePictureUrl: string | null;
    unreadNotifications: number;
    profileInformation: {
        name: string;
        surname: string;
        birthday: Date;
        location: Location | null;
        bio: string | null;
        links: link[];
        onlineAuctions: number;
        pastDeals: number;
        contactData: contactData[];
    } | null = null;
    constructor(dto: UserDTO) {
        this.email = dto.email;
        this.username = dto.username;
        this.profilePictureUrl = dto.profilePictureUrl;
        this.unreadNotifications = dto.unreadNotifications;
    }
}

export type UserDTO = Omit<UserInterface, 'profileInformation'>;

export type UserSummary = {
    username: string;
    profilePictureUrl: string | null;
    location: Location | null;
};

export interface UserCredentials {
    email: string;
    password: string;
}

export interface contactData {
    email?: string;
    phone?: string;
}
