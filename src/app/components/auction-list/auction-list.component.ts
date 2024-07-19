import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuctionSummary } from '../../models/auction.model';
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
    @Input({ required: true }) requestKey!: RequestKey;

    @Input() set loadingStartDelay(delay: number) {
        this.loadingIndicator.startDelay = delay;
    }

    private newRequestSubscription!: Subscription;
    private subscriptions: Subscription[] = [];
    public auctions: ReadonlyArray<AuctionSummary> = [];
    public error: boolean = false;
    public showEmpty: boolean = false;
    public loadingIndicator: LoadingIndicator = new LoadingIndicator(1000);

    public constructor(private readonly auctionsService: AuctionsService) {}

    public ngOnInit(): void {
        this.initRequest();
        this.newRequestSubscription = this.auctionsService
            .newRequest$(this.requestKey)
            .subscribe(this.initRequest.bind(this));
        this.more();
    }

    public ngOnDestroy(): void {
        this.unsubscribeFromRequest();
        this.newRequestSubscription.unsubscribe();
    }

    public scrolled(index: number): void {
        if (index === this.auctions.length - 1) {
            this.more();
        }
    }

    public more(): void {
        this.startLoading();
        this.auctionsService.more(this.requestKey);
    }

    public reloadAfterError(): void {
        this.auctionsService.refresh(this.requestKey);
        this.subscribeToRequest();
        this.more();
    }

    private initRequest(): void {
        this.auctions = this.auctionsService.elements(this.requestKey);
        this.unsubscribeFromRequest();
        this.subscribeToRequest();
    }

    private subscribeToRequest(): void {
        this.subscriptions.push(
            ...[
                this.auctionsService.loadingEnded$(this.requestKey).subscribe({
                    next: () => this.stopLoading(),
                    complete: () => this.stopLoading(),
                }),
                this.auctionsService.data$(this.requestKey).subscribe({
                    next: () => (this.error = false),
                    error: () => (this.error = true),
                }),
            ],
        );
    }

    private unsubscribeFromRequest(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    private startLoading(): void {
        this.loadingIndicator.start();
        this.showEmpty = false;
    }

    private stopLoading(): void {
        this.loadingIndicator.stop();
        this.showEmpty = true;
        if (this.loadingIndicator.startDelay > 0) {
            this.loadingIndicator.startDelay = 0;
        }
    }
}
