import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Auction } from '../../models/auction.model';
import { AuctionTypeLinkComponent } from '../auction-type-link/auction-type-link.component';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { IntervalPipe } from '../../pipes/interval.pipe';

@Component({
  selector: 'dd24-auction-card',
  standalone: true,
  imports: [
    CommonModule,
    AuctionTypeLinkComponent,
    OneCharUpperPipe,
    LocalDatePipe,
    IntervalPipe,
  ],
  templateUrl: './auction-card.component.html',
  styleUrl: './auction-card.component.scss',
})
export class AuctionCardComponent {
  @Input({ required: true }) auction!: Auction;
  currencyCode: string = 'EUR';
}
