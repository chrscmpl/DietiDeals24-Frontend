import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { SearchPolicy } from '../enums/search-policy.enum';

export type AuctionSearchParameters = Partial<{
    keywords: string;
    type: AuctionRuleSet;
    category: string;
    macroCategory: string;
    policy: SearchPolicy;
}>;
