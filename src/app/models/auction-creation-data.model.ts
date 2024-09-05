import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { UploadedFile } from './uploaded-file.model';

export interface AuctionCreationData {
    ruleset: AuctionRuleSet;
    category: string;
    details: {
        title: string;
        conditions: string | null | undefined;
        description: string | null | undefined;
        country: string;
        city: string;
        startingBid: number;
        currency: string;
        endTime: Date;
    };
    pictures: UploadedFile[];
}
