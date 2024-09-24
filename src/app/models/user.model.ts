import { UserDTO, UserSummaryDTO } from '../dtos/user.dto';
import { userLink } from './user-link.model';

export class UserSummary {
    protected _id: string;
    protected _username: string;
    protected _profilePictureUrl: string | null;
    protected _country: string;
    protected _city: string;

    public constructor(dto: UserSummaryDTO) {
        this._id = String(dto.userId);
        this._username = dto.username;
        this._profilePictureUrl = dto.profilePictureUrl ?? null;
        this._country = dto.country;
        this._city = dto.city;
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

    public get country(): string {
        return this._country;
    }

    public get city(): string {
        return this._city;
    }
}

export class User extends UserSummary {
    protected _onlineAuctionsCounter: number;
    protected _pastDealsCounter: number;
    protected _bio: string | null;
    protected _links: userLink[];

    public constructor(dto: UserDTO) {
        super(dto);
        this._onlineAuctionsCounter = dto.onlineAuctionsCounter ?? 0;
        this._pastDealsCounter = dto.pastDealsCounter ?? 0;
        this._bio = dto.bio ?? null;
        this._links =
            dto.links?.map((link) => ({
                id: String(link.id),
                name: link.description,
                url: link.link,
            })) ?? [];
    }

    public get onlineAuctionsCounter(): number {
        return this._onlineAuctionsCounter;
    }

    public get pastDealsCounter(): number {
        return this._pastDealsCounter;
    }

    public get bio(): string | null {
        return this._bio;
    }

    public get links(): userLink[] {
        return this._links;
    }
}
