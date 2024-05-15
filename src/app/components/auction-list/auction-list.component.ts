import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Auction } from '../../models/auction.model';
import { AuctionCardComponent } from '../auction-card/auction-card.component';
import { PaginatedRequest } from '../../helpers/paginatedRequest';
import { ReloadButtonComponent } from '../reload-button/reload-button.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'dd24-auction-list',
    standalone: true,
    imports: [AuctionCardComponent, ReloadButtonComponent],
    templateUrl: './auction-list.component.html',
    styleUrl: './auction-list.component.scss',
})
export class AuctionListComponent implements OnInit, OnDestroy {
    @Input({ required: true }) request!: PaginatedRequest<Auction> | null;

    private dataSubscription!: Subscription | null;
    public auctions: Auction[] = [];
    public error: boolean = false;

    public constructor() {}

    ngOnInit(): void {
        this.subscribeToData();
        this.request?.more();
    }

    ngOnDestroy(): void {
        this.dataSubscription?.unsubscribe();
    }

    scrolled(index: number): void {
        if (index === this.auctions.length - 1) {
            this.request?.more();
        }
    }

    reloadAfterError(): void {
        this.request?.refresh();
        this.subscribeToData();
        this.request?.more();
    }

    private subscribeToData(): void {
        this.dataSubscription =
            this.request?.data$.subscribe({
                next: (auctions) => {
                    this.error = false;
                    this.auctions.push(...auctions);
                },
                error: (err) => {
                    this.error = true;
                    console.error(err);
                },
            }) ?? null;
    }
}
