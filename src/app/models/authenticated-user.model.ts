import { AuthenticatedUserDTO } from '../dtos/authentication.dto';
import { AccountProvider } from '../enums/account-provider.enum';
import { userLink } from './user-link.model';

export class AuthenticatedUser {
    private _id: string;
    private _username: string;
    private _name: string;
    private _surname: string;
    private _birthday: Date;
    private _email: string;
    private _onlineAuctionsCounter: number;
    private _activeBidsCounter: number;
    private _pastBidsCounter: number;
    private _pastAuctionsCounter: number;
    private _profilePictureUrl: string | null;
    private _country: string;
    private _city: string;
    private _bio: string | null;
    private _links: userLink[];
    private _provider: AccountProvider;

    public constructor(dto: AuthenticatedUserDTO) {
        this._id = String(dto.userId);
        this._username = dto.username;
        this._name = dto.name;
        this._surname = dto.surname;
        this._birthday = new Date(dto.birthday);
        this._email = dto.email;
        this._onlineAuctionsCounter = dto.onlineAuctionsCounter ?? 0;
        this._activeBidsCounter = dto.onlineBidsCounter ?? 0;
        this._pastBidsCounter = dto.pastBidsCounter ?? 0;
        this._pastAuctionsCounter = dto.pastAuctionsCounter ?? 0;
        this._profilePictureUrl = dto.profilePictureUrl ?? null;
        this._country = dto.country;
        this._city = dto.city;
        this._bio = dto.bio ?? null;
        this._links =
            dto.links?.map((link) => ({
                id: String(link.id),
                name: link.description,
                url: link.link,
            })) ?? [];
        this._provider = dto.provider;
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

    public get birthday(): Date {
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

    public get pastDealsCounter(): number {
        return this._pastAuctionsCounter + this._pastBidsCounter;
    }

    public get profilePictureUrl(): string | null {
        return this._profilePictureUrl;
    }

    public get country(): string {
        return this._country;
    }

    public get city(): string {
        return this._city;
    }

    public get bio(): string | null {
        return this._bio;
    }

    public get links(): userLink[] {
        return this._links;
    }

    public set links(value: userLink[]) {
        this._links = value;
    }

    public get provider(): AccountProvider {
        return this._provider;
    }
}
