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
import { combineLatest, Subscription, take } from 'rxjs';
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
    private subscriptions: Subscription[] = [];
    public categoryButtonsLoadingIndicator: LoadingIndicator =
        new LoadingIndicator(0);

    public readonly auctionsRequestKey: string = '/home';

    public trendingCategories: string[] = [];

    constructor(
        public readonly categoriesService: CategoriesService,
        public readonly auctionsService: AuctionsService,
        public readonly windowService: WindowService,
    ) {}

    public ngOnInit(): void {
        this.auctionsService.setIfAbsent(this.auctionsRequestKey, {
            queryParameters: {},
            pageSize: 10,
            maximumResults: 20,
            eager: true,
        });

        let loading = true;
        this.categoryButtonsLoadingIndicator.start();
        this.subscriptions.push(
            combineLatest([
                this.categoriesService.getTrendingCategories().pipe(take(1)),
                this.windowService.isMobile$,
            ]).subscribe(([categories, isMobile]) => {
                this.trendingCategories = isMobile
                    ? categories.slice(0, 6)
                    : categories;

                if (loading) {
                    loading = false;
                    this.categoryButtonsLoadingIndicator.stop();
                }
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
