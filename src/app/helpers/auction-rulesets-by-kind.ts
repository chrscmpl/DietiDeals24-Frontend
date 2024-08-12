import { AuctionKind } from '../enums/auction-kind.enum';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';

export const auctionRuleSetsByKind = new Map<AuctionKind, AuctionRuleSet[]>([
    [AuctionKind.selling, [AuctionRuleSet.silent]],
    [AuctionKind.buying, [AuctionRuleSet.reverse]],
]);
