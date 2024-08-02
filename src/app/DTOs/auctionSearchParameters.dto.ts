import { AuctionType } from '../enums/auctionType.enum';
import { SearchPolicy } from '../enums/searchPolicy.enum';

export type AuctionSearchParameters = Partial<{
    keywords: string;
    type: AuctionType;
    category: string;
    macroCategory: string;
    policy: SearchPolicy;
}>;
