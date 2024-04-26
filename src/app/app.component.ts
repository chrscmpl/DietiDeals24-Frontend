import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuctionCardComponent } from './components/auction-card/auction-card.component';
import { Auction, SilentAuction, ReverseAuction } from './models/auction.model';

@Component({
  selector: 'dd24-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AuctionCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  auctions: Auction[] = [
    new SilentAuction({
      id: '1',
      title: 'Iphone 14',
      description: 'New Iphone 14',
      conditions: 'new',
      location: { nation: 'USA', city: 'New York' },
      minimumBid: 1000,
      timeLeft: 10 + 2 * 60 + 5 * 60 * 60,
      imageUrl:
        'data:image/jpeg;base64,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',
    }),

    new ReverseAuction({
      id: '2',
      title: 'BMW',
      description: 'New BMW',
      conditions: 'new',
      location: { nation: 'Italy', city: 'Palermo' },
      maximumStartingBid: 4000,
      lowestBid: 3000,
      timeLeft: 1003823,
      imageUrl:
        'https://www.bmw.it/content/dam/bmw/common/all-models/m-series/series-overview/bmw-m-series-seo-overview-ms-04.jpg',
    }),
  ];
}
