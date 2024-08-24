import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { UploadedFile } from './uploaded-file.model';

export interface AuctionCreationData {
    ruleset: AuctionRuleSet;
    category: string;
    details: {
        title: string;
        conditions: string;
        description: string;
        country: string;
        city: string;
        startingBid: number;
        currency: string;
        endTime: Date;
    };
    pictures: UploadedFile[];
}
