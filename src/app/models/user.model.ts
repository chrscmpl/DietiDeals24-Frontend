import { AuthenticatedUserDTO, UserSummaryDTO } from '../DTOs/user.dto';
import { GeographicalLocation } from './location.model';

export interface userLink {
    name: string;
    url: string;
}

export class AuthenticatedUser {
    private _id: string;
    private _username: string;
    private _name: string;
    private _surname: string;
    private _birthday: string;
    private _email: string;
    private _onlineAuctionsCounter: number;
    private _activeBidsCounter: number;
    private _pastBidsCounter: number;
    private _pastAuctionsCounter: number;
    private _profilePictureUrl: string | null;
    private _country: string | null;
    private _city: string | null;
    private _bio: string | null;
    private _links: userLink[];

    public constructor(dto: AuthenticatedUserDTO) {
        this._id = String(dto.userId);
        this._username = dto.username;
        this._name = dto.name;
        this._surname = dto.surname;
        this._birthday = dto.birthday;
        this._email = dto.email;
        this._onlineAuctionsCounter = dto.onlineAuctionsCounter ?? 0;
        this._activeBidsCounter = dto.onlineBidsCounter ?? 0;
        this._pastBidsCounter = dto.pastBidsCounter ?? 0;
        this._pastAuctionsCounter = dto.pastAuctionsCounter ?? 0;
        this._profilePictureUrl = dto.profilePictureUrl ?? null;
        this._country = dto.country ?? null;
        this._city = dto.city ?? null;
        this._bio = dto.bio ?? null;
        this._links = dto.links ?? [];
    }

    public get id(): string {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    public get name(): string {
        return this._name;
    }

    public get surname(): string {
        return this._surname;
    }

    public get birthday(): string {
        return this._birthday;
    }

    public get email(): string {
        return this._email;
    }

    public get onlineAuctionsCounter(): number {
        return this._onlineAuctionsCounter;
    }

    public get activeBidsCounter(): number {
        return this._activeBidsCounter;
    }

    public get pastBidsCounter(): number {
        return this._pastBidsCounter;
    }

    public get pastAuctionsCounter(): number {
        return this._pastAuctionsCounter;
    }

    public get profilePictureUrl(): string | null {
        return this._profilePictureUrl;
    }

    public get country(): string | null {
        return this._country;
    }

    public get city(): string | null {
        return this._city;
    }

    public get bio(): string | null {
        return this._bio;
    }

    public get links(): userLink[] {
        return this._links;
    }
}

export class UserSummary {
    private _id: string;
    private _username: string;
    private _profilePictureUrl: string | null;
    private _location: GeographicalLocation;

    public constructor(dto: UserSummaryDTO) {
        this._id = dto.userId;
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

    public get location(): GeographicalLocation {
        return this._location;
    }
}
