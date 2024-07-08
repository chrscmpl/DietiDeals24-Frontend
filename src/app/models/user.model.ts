import { UserDTO } from '../DTOs/user.dto';
import { link } from '../helpers/links';
import { Location } from './location.model';

export interface ProfileInformationInterface {
    name: string;
    surname: string;
    birthday: Date;
    location: Location | null;
    bio: string | null;
    links: link[];
    onlineAuctions: number;
    pastDeals: number;
    contactData: contactData[];
}

export interface UserInterface {
    email: string;
    username: string;
    profilePictureUrl: string | null;
    unreadNotificationsCounter: number;
    profileInformation: ProfileInformationInterface | null;
}

export class User implements UserInterface {
    email: string;
    username: string;
    profilePictureUrl: string | null;
    unreadNotificationsCounter: number;
    profileInformation: ProfileInformationInterface | null = null;
    constructor(dto: UserDTO) {
        this.email = dto.email;
        this.username = dto.username;
        this.profilePictureUrl = dto.profilePictureUrl;
        this.unreadNotificationsCounter = dto.unreadNotificationsCounter;
    }
}

export type UserSummary = {
    username: string;
    profilePictureUrl: string | null;
    location: Location | null;
};

export interface contactData {
    email?: string;
    phone?: string;
}
