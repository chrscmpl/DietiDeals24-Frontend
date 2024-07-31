import { AuctionType, AuctionStatus } from '../typeUtils/auction.utils';

export interface AuctionDTO {
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

    category?: string | null;
    description?: string | null;
    numberOfBids?: number | null;
    userId?: string | null;
    picturesUrls?: string[] | null;
}

export interface SilentAuctionDTO extends AuctionDTO {
    type: AuctionType.silent;
    minimumBid: number;
}

export interface ReverseAuctionDTO extends AuctionDTO {
    type: AuctionType.reverse;
    maximumBid: number;
    lowestBidSoFar: number;
}
