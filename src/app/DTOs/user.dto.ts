import { userLinkDTO } from './user-link.dto';

export type UserSummaryDTO = {
    userId: string;
    username: string;
    profilePictureUrl?: string | null;
    country: string;
    city: string;
};

export interface UserDTO extends UserSummaryDTO {
    onlineAuctionsCounter: number;
    pastDealsCounter: number;
    bio: string | null;
    links: userLinkDTO[];
}
