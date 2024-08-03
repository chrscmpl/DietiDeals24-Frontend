import { AuctionType } from '../enums/auction-type.enum';
import { SearchPolicy } from '../enums/search-policy.enum';

export type AuctionSearchParameters = Partial<{
    keywords: string;
    type: AuctionType;
    category: string;
    macroCategory: string;
    policy: SearchPolicy;
}>;
