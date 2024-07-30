import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { take } from 'rxjs';
import { AuctionCardComponent } from '../../../components/auction-card/auction-card.component';

@Component({
    selector: 'dd24-bidding-page',
    standalone: true,
    imports: [AuctionCardComponent],
    templateUrl: './bidding-page.component.html',
    styleUrl: './bidding-page.component.scss',
})
export class BiddingPageComponent implements OnInit {
    public auction?: Auction;

    constructor(private readonly route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.parent?.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
        });
    }
}
