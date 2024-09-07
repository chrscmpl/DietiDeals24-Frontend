import { AuctionStatus } from '../enums/auction-status.enum';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { AuctionCreationData } from '../models/auction-creation-data.model';

export interface AuctionDTO {
    id: string;
    type: AuctionRuleSet;
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
    lastBidderId?: string | null;
    picturesUrls?: string[] | null;

    startingBid?: number | null;
    lastBid?: number | null;
}

export interface SilentAuctionDTO extends AuctionDTO {
    type: AuctionRuleSet.silent;
    minimumBid: number;
    highestBidSoFar?: number;
}

export interface ReverseAuctionDTO extends AuctionDTO {
    type: AuctionRuleSet.reverse;
    maximumBid: number;
    lowestBidSoFar: number;
}

export type AuctionCreationDTO = Omit<
    AuctionCreationData,
    'details' | 'pictures'
> &
    Omit<AuctionCreationData['details'], 'endTime'>
  & {
        pictures: string[];
        endTime: string;
    };
