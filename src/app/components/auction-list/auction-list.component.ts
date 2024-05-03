import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    Auction,
    ReverseAuction,
    SilentAuction,
} from '../../models/auction.model';
import { AuctionCardComponent } from '../auction-card/auction-card.component';
import { PaginatedRequest } from '../../helpers/paginatedRequest';

@Component({
    selector: 'dd24-auction-list',
    standalone: true,
    imports: [AuctionCardComponent],
    templateUrl: './auction-list.component.html',
    styleUrl: './auction-list.component.scss',
})
export class AuctionListComponent implements OnInit, OnDestroy {
    @Input({ required: true }) request!: PaginatedRequest<Auction>;

    public auctions: Auction[] = [];
    public error: boolean = false;

    public constructor() {}

    ngOnInit(): void {
        this.request.data$.subscribe({
            next: (auctions) => {
                this.auctions.push(...auctions);
            },
            error: (err) => {
                this.error = true;
                console.error(err);
            },
        });
        this.loadMore();
    }

    ngOnDestroy(): void {
        this.request.clear();
    }

    loadMore(): void {
        this.request.more();
    }

    scrolled(index: number): void {
        if (index === this.auctions.length - 1) {
            this.loadMore();
        }
    }

    trendingAuctions: Auction[] = [
        new SilentAuction({
            id: '1',
            status: Auction.STATUSES.active,
            title: 'Iphone 14',
            description: 'New Iphone 14',
            conditions: 'new',
            location: { country: 'USA', city: 'New York' },
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
            location: { country: 'Italy', city: 'Palermo' },
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
