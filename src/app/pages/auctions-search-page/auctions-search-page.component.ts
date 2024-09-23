import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { AsyncPipe } from '@angular/common';
import { AuctionsService } from '../../services/auctions.service';
import { WindowService } from '../../services/window.service';
import { SideSearchSectionComponent } from '../../components/side-search-section/side-search-section.component';
import { SearchService } from '../../services/search.service';
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    ReplaySubject,
    Subscription,
    take,
    tap,
} from 'rxjs';
import { SearchSectionComponent } from '../../components/search-section/search-section.component';
import { AuctionSearchParameters } from '../../DTOs/auction-search-parameters.dto';

@Component({
    selector: 'dd24-auctions-search-page',
    standalone: true,
    imports: [
        AuctionListComponent,
        AsyncPipe,
        SideSearchSectionComponent,
        SearchSectionComponent,
    ],
    templateUrl: './auctions-search-page.component.html',
    styleUrl: './auctions-search-page.component.scss',
})
export class AuctionsSearchPageComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('mobileSearchSection')
    mobileSearchSection?: SearchSectionComponent;

    private static readonly REQUEST_KEY = '/auctions';
    private readonly subscriptions: Subscription[] = [];
    private readonly requestKeySubject = new ReplaySubject<void>(1);

    public readonly requestKey$ = this.requestKeySubject.asObservable().pipe(
        map(() => AuctionsSearchPageComponent.REQUEST_KEY),
        distinctUntilChanged(),
    );

    constructor(
        private readonly searchService: SearchService,
        private readonly auctionsService: AuctionsService,
        public readonly windowService: WindowService,
    ) {}

    public ngOnInit(): void {
        let initialized = false;
        let newParams = false;

        this.subscriptions.push(
            combineLatest([
                this.searchService.validatedSearchParameters$.pipe(
                    tap(() => (newParams = true)),
                ),
                this.windowService.isMobile$,
            ])
                .pipe(
                    debounceTime(100),
                    filter(
                        ([params, isMobile]) =>
                            (initialized ||
                                !isMobile ||
                                Object.keys(params).length > 0) &&
                            newParams,
                    ),
                    map((params) => params[0]),
                    tap(() => {
                        newParams = false;
                        initialized = true;
                    }),
                )
                .subscribe(this.startSearch.bind(this)),
        );
    }

    public ngAfterViewInit(): void {
        this.windowService.isMobile$.pipe(take(1)).subscribe((isMobile) => {
            if (isMobile) {
                this.mobileSearchSection?.focusKeywordsInput();
            }
        });
    }

    public ngOnDestroy(): void {
        this.requestKeySubject.complete();
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    private startSearch(params: AuctionSearchParameters) {
        this.auctionsService.set(AuctionsSearchPageComponent.REQUEST_KEY, {
            queryParameters: params,
            pageSize: 10,
            eager: true,
        });
        this.requestKeySubject.next();
    }
}
