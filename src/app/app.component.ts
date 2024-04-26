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
      endTime: Math.floor(Date.now() / 1000) + 10 + 2 * 60 + 5 * 60 * 60,
    }),

    new ReverseAuction({
      id: '2',
      title: 'BMW',
      description: 'New BMW',
      conditions: 'new',
      location: { nation: 'Italy', city: 'Palermo' },
      maximumStartingBid: 4000,
      lowestBid: 3000,
      endTime: Math.floor(Date.now() / 1000) + 1003823,
      images: [
        'https://www.bmw.it/content/dam/bmw/common/all-models/m-series/series-overview/bmw-m-series-seo-overview-ms-04.jpg',
      ],
    }),
  ];
}
