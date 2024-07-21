import { AuctionType, auctionStatus } from '../typeUtils/auction.utils';

export interface AuctionSummaryDTO {
    id: string;
    username: string;
    type: AuctionType;
    status: auctionStatus;
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
