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
