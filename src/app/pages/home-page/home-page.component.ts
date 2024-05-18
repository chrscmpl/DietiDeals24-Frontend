import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuctionCardComponent } from '../../components/auction-card/auction-card.component';
import { LoadingIndicator } from '../../helpers/loadingIndicator';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { AuctionsService } from '../../services/auctions.service';
import { ButtonModule } from 'primeng/button';
import { WindowService } from '../../services/window.service';

@Component({
    selector: 'dd24-home-page',
    standalone: true,
    imports: [
        RouterLink,
        AsyncPipe,
        AuctionCardComponent,
        AuctionListComponent,
        ButtonModule,
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
    public categoryButtonsLoadingIndicator: LoadingIndicator =
        new LoadingIndicator(0);
    public trendingAuctionsRequest = this.auctionsService.getAuctionsRequest({
        queryParameters: {},
        pageNumber: 1,
        pageSize: 10,
        maximumResults: 20,
        eager: true,
    });

    constructor(
        public accessoryInformation: CategoriesService,
        public auctionsService: AuctionsService,
        public windowService: WindowService,
    ) {}

    ngOnInit(): void {
        this.categoryButtonsLoadingIndicator.start();
        this.accessoryInformation.trendingCategories$.subscribe(() => {
            this.categoryButtonsLoadingIndicator.stop();
        });
        this.accessoryInformation.refreshTrendingCategories({
            error: (err) => {
                console.error(err);
            },
        });
    }
}
