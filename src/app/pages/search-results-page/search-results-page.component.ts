import { Component, OnInit } from '@angular/core';
import { AuctionsService } from '../../services/auctions.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatedRequest } from '../../helpers/paginatedRequest';
import { Auction } from '../../models/auction.model';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';

@Component({
    selector: 'dd24-search-results-page',
    standalone: true,
    imports: [AuctionListComponent],
    templateUrl: './search-results-page.component.html',
    styleUrl: './search-results-page.component.scss',
})
export class SearchResultsPageComponent implements OnInit {
    constructor(
        private auctionsService: AuctionsService,
        private route: ActivatedRoute,
    ) {}

    public query: string | null = null;
    public request: PaginatedRequest<Auction> | null = null;

    ngOnInit(): void {
        this.query = this.route.snapshot.params['query'];

        // this.request = this.auctionsService.getAuctionsRequest({
        //     pageNumber: 1,
        //     pageSize: 10,
        //     queryParameters: query,
        //     eager: true,
        // });
    }
}
