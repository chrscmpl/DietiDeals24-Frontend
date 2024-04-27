import { Component, Input } from '@angular/core';
import { Auction, AuctionType } from '../../models/auction.model';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'dd24-auction-type-link',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './auction-type-link.component.html',
  styleUrl: './auction-type-link.component.scss',
})
export class AuctionTypeLinkComponent {
  @Input({ required: true })
  type!: AuctionType;
}
