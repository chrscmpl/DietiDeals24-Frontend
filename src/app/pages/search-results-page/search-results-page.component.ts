import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { AsyncPipe } from '@angular/common';
import { AuctionsService } from '../../services/auctions.service';

@Component({
    selector: 'dd24-search-results-page',
    standalone: true,
    imports: [AuctionListComponent, AsyncPipe],
    templateUrl: './search-results-page.component.html',
    styleUrl: './search-results-page.component.scss',
})
export class SearchResultsPageComponent implements OnInit {
    constructor(
        private readonly route: ActivatedRoute,
        private readonly auctionsService: AuctionsService,
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.auctionsService.set('/auctions', {
                queryParameters: params,
                pageNumber: 1,
                pageSize: 10,
                eager: true,
            });
        });
    }
}
