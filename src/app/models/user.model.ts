import { Location } from './location.model';

export interface UserInterface {
    username: string;
    name: string;
    surname: string;
    birthday: Date;
    profilePictureUrl: string | null;
    location: Location | null;
    bio: string | null;
    links: link[];
    onlineAuctions: number;
    pastDeals: number;
    contactData: contactData[];
}

export class User implements UserInterface {
    username: string;
    name: string;
    surname: string;
    birthday: Date;
    profilePictureUrl: string | null;
    location: Location | null;
    bio: string | null;
    links: link[];
    onlineAuctions: number;
    pastDeals: number;
    contactData: contactData[];
    constructor(dto: UserDTO) {
        this.username = dto.username;
        this.name = dto.name;
        this.surname = dto.surname;
        this.birthday = new Date(dto.birthday);
        this.profilePictureUrl = dto.profilePictureUrl ?? null;
        this.location = dto.location ?? null;
        this.bio = dto.bio ?? null;
        this.links = dto.links ?? [];
        this.onlineAuctions = dto.onlineAuctions;
        this.pastDeals = dto.pastDeals;
        this.contactData = dto.contactData ?? [];
    }
}

export type UserDTO = Omit<
    UserInterface,
    | 'birthday'
    | 'profilePictureUrl'
    | 'location'
    | 'bio'
    | 'links'
    | 'contactData'
> &
    Partial<
        Pick<
            UserInterface,
            'profilePictureUrl' | 'location' | 'bio' | 'links' | 'contactData'
        >
    > & { birthday: number };

export type UserSummary = Pick<UserInterface, 'username' | 'location'>;

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
