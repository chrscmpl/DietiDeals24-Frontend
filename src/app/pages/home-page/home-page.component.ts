import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuctionCardComponent } from '../../components/auction-card/auction-card.component';
import { LoadingIndicator } from '../../helpers/loading-indicator';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { AuctionsService } from '../../services/auctions.service';
import { ButtonModule } from 'primeng/button';
import { WindowService } from '../../services/window.service';
import { Subscription } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';

@Component({
    selector: 'dd24-home-page',
    standalone: true,
    imports: [
        RouterLink,
        AsyncPipe,
        AuctionCardComponent,
        AuctionListComponent,
        ButtonModule,
        CarouselModule,
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
    public categoryButtonsLoadingIndicator: LoadingIndicator =
        new LoadingIndicator(0);

    public readonly auctionsRequestKey: string = '/home';

    private readonly subscriptions: Subscription[] = [];

    constructor(
        public readonly categoriesService: CategoriesService,
        public readonly auctionsService: AuctionsService,
        public readonly windowService: WindowService,
    ) {}

    ngOnInit(): void {
        this.auctionsService.setIfAbsent(this.auctionsRequestKey, {
            queryParameters: {},
            pageNumber: 1,
            pageSize: 10,
            maximumResults: 20,
            eager: true,
        });

        this.categoryButtonsLoadingIndicator.start();
        this.subscriptions.push(
            this.categoriesService.trendingCategories$.subscribe(() => {
                this.categoryButtonsLoadingIndicator.stop();
            }),
        );
        this.categoriesService.refreshTrendingCategories({
            error: (err) => {
                console.error(err);
            },
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
