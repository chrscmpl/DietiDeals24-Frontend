import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { combineLatest, take } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { WindowService } from '../../../services/window.service';

enum CheckoutOperation {
    bid,
    conclude,
}

@Component({
    selector: 'dd24-checkout-page',
    standalone: true,
    imports: [CurrencyPipe, AsyncPipe],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
    public readonly OPERATIONS = CheckoutOperation;
    public bidAmount?: number;
    public auction?: Auction;
    public operation?: CheckoutOperation;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        public readonly windowService: WindowService,
    ) {}

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

                    this.operation =
                        CheckoutOperation[
                            url[0].path as keyof typeof CheckoutOperation
                        ];

                    if (this.operation === CheckoutOperation.conclude)
                        this.bidAmount = this.auction?.winningBid ?? undefined;

                    if (
                        !this.auction ||
                        this.operation === undefined ||
                        this.bidAmount === undefined
                    )
                        this.router.navigate(['..'], {
                            relativeTo: this.route,
                        });
                });
    }
}
