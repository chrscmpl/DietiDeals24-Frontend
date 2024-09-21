import {
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuctionCardComponent } from '../../components/auction-card/auction-card.component';
import { LoadingIndicator } from '../../helpers/loading-indicator';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { AuctionsService } from '../../services/auctions.service';
import { ButtonModule } from 'primeng/button';
import { WindowService } from '../../services/window.service';
import { fromEvent, startWith, Subscription, take, throttleTime } from 'rxjs';
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
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('trendingCategoriesButtonsContainer')
    private readonly trendingCategoriesButtonsContainer!: ElementRef;
    private lastTrendingCategoriesButtonsHeight: number | null = null;
    private static readonly TRENDING_CATEGORIES_BUTTONS_DESKTOP_PADDING = 5;

    private subscriptions: Subscription[] = [];
    private resizeSubscription: Subscription | null = null;

    public readonly categoryButtonsLoadingIndicator: LoadingIndicator =
        new LoadingIndicator(0);

    public readonly auctionsRequestKey: string = '/home';

    public trendingCategories: string[] = [];

    constructor(
        public readonly categoriesService: CategoriesService,
        public readonly auctionsService: AuctionsService,
        public readonly windowService: WindowService,
        public readonly zone: NgZone,
    ) {}

    public ngOnInit(): void {
        this.auctionsService.setIfAbsent(this.auctionsRequestKey, {
            queryParameters: {},
            pageSize: 10,
            maximumResults: 20,
            eager: true,
        });

        this.categoryButtonsLoadingIndicator.start();
        this.categoriesService
            .getTrendingCategories()
            .pipe(take(1))
            .subscribe((categories) => {
                this.trendingCategories = categories;
                this.categoryButtonsLoadingIndicator.stop();
            });
    }

    public ngAfterViewInit(): void {
        this.subscriptions.push(
            this.windowService.isMobile$.subscribe((isMobile) =>
                isMobile ? this.onMobile() : this.onDesktop(),
            ),
        );
    }

    public ngOnDestroy(): void {
        this.resizeSubscription?.unsubscribe();
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    private onMobile(): void {
        this.resizeSubscription?.unsubscribe();
        this.trendingCategoriesButtonsContainer.nativeElement.style.height =
            'auto';

        this.trendingCategoriesButtonsContainer.nativeElement.style.paddingTop = 0;
        this.trendingCategoriesButtonsContainer.nativeElement.style.paddingBottom = 0;
    }

    private onDesktop(): void {
        this.lastTrendingCategoriesButtonsHeight = null;
        this.trendingCategoriesButtonsContainer.nativeElement.style.paddingTop = `${HomePageComponent.TRENDING_CATEGORIES_BUTTONS_DESKTOP_PADDING}px`;
        this.trendingCategoriesButtonsContainer.nativeElement.style.paddingBottom = `${HomePageComponent.TRENDING_CATEGORIES_BUTTONS_DESKTOP_PADDING}px`;
        this.zone.runOutsideAngular(() => {
            this.resizeSubscription = fromEvent(window, 'resize', {
                passive: true,
            })
                .pipe(throttleTime(50), startWith(null))
                .subscribe(
                    this.setTrendingCategoriesButtonsFixedHeight.bind(this),
                );
        });
    }

    private setTrendingCategoriesButtonsFixedHeight(): void {
        const height = this.getHightestTrendingCategoryButtonHeight();
        if (this.lastTrendingCategoriesButtonsHeight === height) return;

        this.lastTrendingCategoriesButtonsHeight = height;
        this.trendingCategoriesButtonsContainer.nativeElement.style.height = `${height + HomePageComponent.TRENDING_CATEGORIES_BUTTONS_DESKTOP_PADDING * 2}px`;
    }

    private getHightestTrendingCategoryButtonHeight(): number {
        const buttons: HTMLCollectionOf<HTMLButtonElement> =
            this.trendingCategoriesButtonsContainer.nativeElement.querySelectorAll(
                'button',
            );
        return Math.max(
            ...Array.from(buttons).map((button) => button.offsetHeight),
        );
    }
}
