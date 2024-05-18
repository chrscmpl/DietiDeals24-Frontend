import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AuctionType } from '../../typeUtils/auction.utils';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dd24-auction-type-link',
    standalone: true,
    imports: [UpperCasePipe, RouterLink],
    templateUrl: './auction-type-link.component.html',
    styleUrl: './auction-type-link.component.scss',
})
export class AuctionTypeLinkComponent {
    @Input({ required: true })
    type!: AuctionType;
}
