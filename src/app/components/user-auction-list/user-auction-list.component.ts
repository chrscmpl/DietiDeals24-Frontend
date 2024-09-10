import { Component, OnInit } from '@angular/core';
import { AuctionListComponent } from '../auction-list/auction-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dd24-user-auction-list',
    standalone: true,
    imports: [AuctionListComponent],
    templateUrl: './user-auction-list.component.html',
    styleUrl: './user-auction-list.component.scss',
})
export class UserAuctionListComponent implements OnInit {
    public requestKey!: string;

    public constructor(private readonly route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.requestKey = this.route.snapshot.data['auctionsRequestKey'];
    }
}
