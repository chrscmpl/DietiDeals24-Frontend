import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuctionSummary } from '../../models/auction.model';
import { AuctionCardComponent } from '../auction-card/auction-card.component';
import { PaginatedRequest } from '../../helpers/paginatedRequest';
import { ReloadButtonComponent } from '../reload-button/reload-button.component';
import { Subscription } from 'rxjs';
import { LoadingPlaceholderComponent } from '../loading-placeholder/loading-placeholder.component';
import { LoadingIndicator } from '../../helpers/loadingIndicator';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-auction-list',
    standalone: true,
    imports: [
        AuctionCardComponent,
        ReloadButtonComponent,
        LoadingPlaceholderComponent,
        AsyncPipe,
    ],
    templateUrl: './auction-list.component.html',
    styleUrl: './auction-list.component.scss',
})
export class AuctionListComponent implements OnInit, OnDestroy {
    @Input({ required: true })
    request!: PaginatedRequest<AuctionSummary> | null;

    private dataSubscription!: Subscription | null;
    public auctions: AuctionSummary[] = [];
    public error: boolean = false;
    public showEmpty: boolean = false;
    public loadingIndicator: LoadingIndicator = new LoadingIndicator(1000);

    public constructor() {}

    public ngOnInit(): void {
        this.subscribeToData();
        this.more();
    }

    public ngOnDestroy(): void {
        this.dataSubscription?.unsubscribe();
    }

    public scrolled(index: number): void {
        if (index === this.auctions.length - 1) {
            this.more();
        }
    }

    public more(): void {
        this.startLoading();
        this.request?.more();
    }

    public reloadAfterError(): void {
        this.request?.refresh();
        this.subscribeToData();
        this.more();
    }

    private subscribeToData(): void {
        this.dataSubscription =
            this.request?.data$.subscribe({
                next: (auctions) => {
                    this.auctions.push(...auctions);
                    this.error = false;
                    this.stopLoading();
                },
                error: (err) => {
                    this.stopLoading();
                    this.error = true;
                    console.error(err);
                },
                complete: () => {
                    this.stopLoading();
                },
            }) ?? null;
    }

    private startLoading(): void {
        this.loadingIndicator.start();
        this.showEmpty = false;
    }

    private stopLoading(): void {
        this.loadingIndicator.stop();
        this.showEmpty = true;
    }
}
