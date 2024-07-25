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
    description: string;
    bids: number;
    username: string;
    pictureUrl: undefined;
    pictures: string[];
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
