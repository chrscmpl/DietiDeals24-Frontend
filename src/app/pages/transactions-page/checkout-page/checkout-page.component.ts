import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { combineLatest, take } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'dd24-checkout-page',
    standalone: true,
    imports: [CurrencyPipe],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
    public bidAmount?: number;
    public auction?: Auction;
    public operation?: 'bid' | 'conclude';
    constructor(private route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.bidAmount = window.history.state.bidAmount;

        if (this.route.parent?.parent?.data && this.route.parent?.url)
            combineLatest([
                this.route.parent.parent.data,
                this.route.parent.url,
            ])
                .pipe(take(1))
                .subscribe(([data, url]) => {
                    this.auction = data['auction'];

                    this.operation = url[0].path as 'bid' | 'conclude';

                    if (this.operation === 'conclude')
                        this.bidAmount = this.auction?.winningBid ?? undefined;
                });
    }
}
