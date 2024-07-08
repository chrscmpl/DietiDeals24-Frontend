import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatedRequest } from '../../helpers/paginatedRequest';
import { AuctionSummary } from '../../models/auction.model';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { ReplaySubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-search-results-page',
    standalone: true,
    imports: [AuctionListComponent, AsyncPipe],
    templateUrl: './search-results-page.component.html',
    styleUrl: './search-results-page.component.scss',
})
export class SearchResultsPageComponent implements OnInit {
    constructor(private readonly route: ActivatedRoute) {}

    private readonly auctionsRequestSubject = new ReplaySubject<
        PaginatedRequest<AuctionSummary>
    >(1);

    public readonly auctionsRequest$ =
        this.auctionsRequestSubject.asObservable();

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            if (data['request'])
                this.auctionsRequestSubject.next(data['request']);
        });
    }
}
