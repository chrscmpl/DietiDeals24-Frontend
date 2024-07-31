import { UserDTO, UserSummaryDTO } from '../DTOs/user.dto';
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

export class UserSummary {
    private _id: string;
    private _username: string;
    private _profilePictureUrl: string | null;
    private _location: Location;

    public constructor(dto: UserSummaryDTO) {
        this._id = dto.id;
        this._username = dto.username;
        this._profilePictureUrl = dto.profilePictureUrl;
        this._location = { country: dto.country, city: dto.city };
    }

    public get id(): string {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    public get profilePictureUrl(): string | null {
        return this._profilePictureUrl;
    }

    public get location(): Location {
        return this._location;
    }
}
