import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { UploadedFile } from './uploaded-file.model';

interface AuctionDetails {
    title: string;
    conditions: string | null | undefined;
    description: string | null | undefined;
    country: string;
    city: string;
    startingBid: number;
    currency: string;
    endTime: Date;
}

export interface AuctionCreationData {
    ruleset: AuctionRuleSet;
    category: string;
    details: AuctionDetails;
    pictures: UploadedFile[];
}
