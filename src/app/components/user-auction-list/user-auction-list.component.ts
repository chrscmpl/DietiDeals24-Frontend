import { Component, OnInit } from '@angular/core';
import { AuctionListComponent } from '../auction-list/auction-list.component';
import { ActivatedRoute } from '@angular/router';
import {
    auctionsPaginationParams,
    AuctionsService,
} from '../../services/auctions.service';

@Component({
    selector: 'dd24-user-auction-list',
    standalone: true,
    imports: [AuctionListComponent],
    templateUrl: './user-auction-list.component.html',
    styleUrl: './user-auction-list.component.scss',
})
export class UserAuctionListComponent implements OnInit {
    public requestKey!: string;
    public params!: auctionsPaginationParams;

    public filter: null | 'auctions' | 'bids' = null;

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly auctionsService: AuctionsService,
    ) {}

    public ngOnInit(): void {
        this.requestKey = this.route.snapshot.data['auctionsRequestData'].key;
        this.params = this.route.snapshot.data['auctionsRequestData'];

        this.filter = this.params.onlyAuctions
            ? 'auctions'
            : this.params.onlyBids
              ? 'bids'
              : null;

        this.auctionsService.setIfAbsent(this.requestKey, this.params);
    }
}
