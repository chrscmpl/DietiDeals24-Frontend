import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Auction } from '../../models/auction.model';
import { AuctionCardComponent } from '../auction-card/auction-card.component';
import { ReloadButtonComponent } from '../reload-button/reload-button.component';
import { Subscription } from 'rxjs';
import { LoadingPlaceholderComponent } from '../loading-placeholder/loading-placeholder.component';
import { LoadingIndicator } from '../../helpers/loadingIndicator';
import { AsyncPipe } from '@angular/common';
import { AuctionsService, RequestKey } from '../../services/auctions.service';

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
    private static readonly LOADING_STOP_FALLBACK_DELAY = 5000;

    @Input({ required: true }) public set requestKey(value: RequestKey | null) {
        this._requestKey = value;
        if (value === null) return;
        if (this.initialized) {
            this.cancelSubscriptions();
            this.init();
        }
    }

    @Input() set loadingStartDelay(delay: number) {
        this.loadingIndicator.startDelay = delay;
    }

    private _requestKey!: RequestKey | null;
    private readonly subscriptions: Subscription[] = [];
    public auctions: ReadonlyArray<Auction> = [];
    public error: boolean = false;
    public showEmpty: boolean = false;
    public loadingIndicator: LoadingIndicator = new LoadingIndicator(1000);
    private initialized: boolean = false;
    private lastLength: number = 0;
    private _pageSize: number = -1;
    private itemsBeforeMore: number = 0;
    private loading: boolean = false;

    private get pageSize(): number {
        return this._pageSize;
    }

    private set pageSize(value: number) {
        this._pageSize = value;
        this.itemsBeforeMore = Math.floor(value / 4) * 3;
    }

    public get requestKey(): RequestKey | null {
        return this._requestKey;
    }

    public constructor(private readonly auctionsService: AuctionsService) {}

    public ngOnInit(): void {
        this.init();
        this.initialized = true;
    }

    public ngOnDestroy(): void {
        this.cancelSubscriptions();
    }

    public scrolled(index: number): void {
        if (this.shouldLoadMore(index)) {
            this.lastLength = this.auctions.length;
            this.more();
        }
    }

    private shouldLoadMore(index: number) {
        return index >= this.lastLength + this.itemsBeforeMore;
    }

    public more(): void {
        if (this.requestKey === null) return;
        this.startLoading();
        this.auctionsService.more(this.requestKey);
    }

    public reloadAfterError(): void {
        if (this.requestKey === null) return;
        this.error = false;
        this.startLoading();
        this.auctionsService.refresh(this.requestKey);
        this.more();
    }

    private init(): void {
        if (this.requestKey === null) return;
        this.error = false;
        this.showEmpty = false;
        this.startLoading();
        this.auctions = this.auctionsService.elements(this.requestKey);
        this.pageSize = this.auctionsService.pageSize(this.requestKey);

        this.subscriptions.push(
            this.auctionsService.subscribeUninterrupted(this.requestKey, {
                next: (auctions: Auction[]) => {
                    this.error = false;
                    this.stopLoading();
                    auctions.forEach((a) => {
                        if (!a.pictureUrl) return;
                        const img = new Image();
                        img.src = a.pictureUrl;
                    });
                },
                error: () => {
                    this.error = true;
                    this.stopLoading();
                },
                complete: () => {
                    this.stopLoading();
                },
                reset: () => {
                    this.error = false;
                    this.showEmpty = false;
                    this.startLoading();
                    if (this.requestKey)
                        this.pageSize = this.auctionsService.pageSize(
                            this.requestKey,
                        );
                },
            }),
        );

        if (!this.auctions.length) this.more();
    }

    private startLoading(): void {
        this.loading = true;
        this.loadingIndicator.start();
        this.showEmpty = false;
        setTimeout(() => {
            if (this.loading) this.stopLoading();
        }, this.loadingIndicator.startDelay + AuctionListComponent.LOADING_STOP_FALLBACK_DELAY);
    }

    private stopLoading(): void {
        this.loading = false;
        this.loadingIndicator.stop();
        this.showEmpty = true;
        if (this.loadingIndicator.startDelay > 0) {
            this.loadingIndicator.startDelay = 0;
        }
    }

    private cancelSubscriptions(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions.length = 0;
    }
}
