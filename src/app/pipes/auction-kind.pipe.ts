import { Pipe, PipeTransform } from '@angular/core';
import { AuctionKind } from '../enums/auction-kind.enum';

@Pipe({
    name: 'auctionKind',
    standalone: true,
})
export class AuctionKindPipe implements PipeTransform {
    public transform(value: AuctionKind, option: 'bid' | 'create'): string {
        if (
            (option === 'bid' && value === AuctionKind.buying) ||
            (option === 'create' && value === AuctionKind.selling)
        )
            return 'selling';
        else if (
            (option === 'bid' && value === AuctionKind.selling) ||
            (option === 'create' && value === AuctionKind.buying)
        )
            return 'buying';
        return '';
    }
}
