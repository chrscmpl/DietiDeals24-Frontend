import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { AsyncPipe } from '@angular/common';
import { AuctionsService } from '../../services/auctions.service';
import { WindowService } from '../../services/window.service';
import { SideSearchSectionComponent } from '../../components/side-search-section/side-search-section.component';

@Component({
    selector: 'dd24-auctions-search-page',
    standalone: true,
    imports: [AuctionListComponent, AsyncPipe, SideSearchSectionComponent],
    templateUrl: './auctions-search-page.component.html',
    styleUrl: './auctions-search-page.component.scss',
})
export class AuctionsSearchPageComponent implements OnInit {
    constructor(
        private readonly route: ActivatedRoute,
        private readonly auctionsService: AuctionsService,
        public readonly windowService: WindowService,
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
