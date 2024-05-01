import { Component } from '@angular/core';
import { AccessoryInformationService } from '../../services/accessory-information.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
    Auction,
    SilentAuction,
    ReverseAuction,
} from '../../models/auction.model';
import { AuctionCardComponent } from '../../components/auction-card/auction-card.component';

@Component({
    selector: 'dd24-home-page',
    standalone: true,
    imports: [RouterLink, AsyncPipe, AuctionCardComponent],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
    constructor(public accessoryInformation: AccessoryInformationService) {}

    trendingAuctions: Auction[] = [
        new SilentAuction({
            id: '1',
            status: Auction.STATUSES.active,
            title: 'Iphone 14',
            description: 'New Iphone 14',
            conditions: 'new',
            location: { nation: 'USA', city: 'New York' },
            minimumBid: { amount: 1000, currency: 'EUR' },
            endTime: Math.floor(Date.now() / 1000) + 10 + 2 * 60 + 5 * 60 * 60,
            category: 'Electronics',
        }),

        new ReverseAuction({
            id: '2',
            status: Auction.STATUSES.active,
            title: 'BMW',
            description: 'New BMW',
            conditions: 'new',
            location: { nation: 'Italy', city: 'Palermo' },
            maximumStartingBid: { amount: 4000, currency: 'EUR' },
            lowestBid: { amount: 3000, currency: 'EUR' },
            endTime: Math.floor(Date.now() / 1000) + 1003823,
            images: [
                'https://www.bmw.it/content/dam/bmw/common/all-models/m-series/series-overview/bmw-m-series-seo-overview-ms-04.jpg',
            ],
            category: 'Cars',
        }),
    ];
}
