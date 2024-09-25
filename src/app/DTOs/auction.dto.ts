import { AuctionStatus } from '../enums/auction-status.enum';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';

export interface AuctionDTO {
    id: string;
    type: AuctionRuleSet;
    status: AuctionStatus;
    title: string;
    conditions?: string | null;
    country: string;
    city: string;
    endTime: string;
    picturesUrl?: string | null;
    currency: string;

    category?: string | null;
    description?: string | null;
    numberOfBids?: number | null;
    userId?: string | null;
    currentBidderId?: string | null;
    picturesUrls?: string[] | null;

    startingBid?: number | null;
    lastBid?: number | null;
    ownBid?: number | null;
    ownBids?: { bidAmount: number }[];
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

export interface AuctionCreationDTO {
    auctionType: AuctionRuleSet;
    itemCategory: string;
    itemName: string;
    itemCondition?: string | null;
    description?: string | null;
    country: string;
    city: string;
    currency: string;
    endTime: string;
    picturesUrls: string[];
    startingBid?: number;
    minimumBid?: number;
    maximumBid?: number;
}
