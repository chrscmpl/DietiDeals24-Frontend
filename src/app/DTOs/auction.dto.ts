import { AuctionType, AuctionStatus } from '../typeUtils/auction.utils';

export interface AuctionSummaryDTO {
    id: string;
    type: AuctionType;
    status: AuctionStatus;
    title: string;
    conditions?: string | null;
    country: string;
    city: string;
    endTime: string;
    pictureUrl?: string | null;
    currency: string;
}

export interface SilentAuctionSummaryDTO extends AuctionSummaryDTO {
    type: AuctionType.silent;
    minimumBid: number;
}

export interface ReverseAuctionSummaryDTO extends AuctionSummaryDTO {
    type: AuctionType.reverse;
    maximumStartingBid: number;
    lowestBid: number;
}

export interface AuctionDTO extends AuctionSummaryDTO {
    category: string;
    description?: string | null;
    bids?: number | null;
    username: string;
    profilePictureUrl?: string | null;
    pictureUrl: undefined;
    picturesUrls: string[];
}

export interface SilentAuctionDTO extends AuctionDTO, SilentAuctionSummaryDTO {
    type: AuctionType.silent;
    pictureUrl: undefined;
}

// eslint-disable-next-line prettier/prettier
export interface ReverseAuctionDTO extends AuctionDTO, ReverseAuctionSummaryDTO {
    type: AuctionType.reverse;
    pictureUrl: undefined;
}
