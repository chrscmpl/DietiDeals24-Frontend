import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuctionListComponent } from '../auction-list/auction-list.component';
import { ActivatedRoute } from '@angular/router';
import {
    auctionsPaginationParams,
    AuctionsService,
} from '../../services/auctions.service';
import { omit } from 'lodash-es';
import { distinctUntilChanged, Subscription, take } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

type filterValue = null | 'auctions' | 'bids';

@Component({
    selector: 'dd24-user-auction-list',
    standalone: true,
    imports: [AuctionListComponent, DropdownModule, ReactiveFormsModule],
    templateUrl: './user-auction-list.component.html',
    styleUrl: './user-auction-list.component.scss',
})
export class UserAuctionListComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    public requestKey!: string;
    private originalKey!: string;
    public params!: auctionsPaginationParams;

    public enableFilter: boolean = false;
    public filterControl = new FormControl<filterValue>(null);

    public filterOptions = [
        { label: 'Bids and auctions', value: null },
        { label: 'Bids only', value: 'bids' },
        { label: 'Auctions only', value: 'auctions' },
    ];

    public emptyMessage: string = '';

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly auctionsService: AuctionsService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.params = omit(
                data['auctionsRequestData'],
                'key',
            ) as auctionsPaginationParams;

            this.originalKey = data['auctionsRequestData'].key;

            this.requestKey = this.completeKey(this.originalKey, this.params);

            this.emptyMessage = this.getEmptyMessage();

            this.initFilter();

            this.auctionsService.setIfAbsent(this.requestKey, this.params);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    private initFilter() {
        this.enableFilter = !this.params.ofUser || !this.params.currentAuctions;

        this.filterControl.setValue(
            this.params.onlyAuctions
                ? 'auctions'
                : this.params.onlyBids
                  ? 'bids'
                  : null,
        );

        this.subscriptions.push(
            this.filterControl.valueChanges
                .pipe(distinctUntilChanged())
                .subscribe(this.onFilterChange.bind(this)),
        );
    }

    private onFilterChange(value: filterValue): void {
        this.params.onlyAuctions = value === 'auctions';
        this.params.onlyBids = value === 'bids';
        const key = this.completeKey(this.originalKey, this.params);
        this.auctionsService.setIfAbsent(key, this.params);
        this.requestKey = key;

        this.emptyMessage = this.getEmptyMessage();
    }

    private completeKey(key: string, params: auctionsPaginationParams): string {
        return `${key}${
            params.onlyAuctions ? '/auctions' : params.onlyBids ? '/bids' : ''
        }`;
    }

    private getEmptyMessage(): string {
        let message = '';

        message += this.params.ownAuctions ? 'You have no ' : 'There are no ';

        message += this.params.currentAuctions ? 'current ' : 'past ';

        message += this.params.onlyAuctions
            ? 'auctions'
            : this.params.onlyBids
              ? 'bids'
              : 'auctions or bids';

        message += this.params.ofUser ? ' for this user' : '';

        return message;
    }
}
