import { Pipe, PipeTransform } from '@angular/core';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';

@Pipe({
    name: 'auctionRulesetInformation',
    standalone: true,
})
export class AuctionRulesetInformationPipe implements PipeTransform {
    transform(value: string, _: 'startingBid'): string {
        return value === AuctionRuleSet.silent
            ? 'Minimum bid'
            : value === AuctionRuleSet.reverse
              ? 'Maximum starting bid'
              : 'Starting bid';
    }
}
