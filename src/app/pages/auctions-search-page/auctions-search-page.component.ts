import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuctionListComponent } from '../../components/auction-list/auction-list.component';
import { AsyncPipe } from '@angular/common';
import { AuctionsService } from '../../services/auctions.service';
import { WindowService } from '../../services/window.service';
import { SideSearchSectionComponent } from '../../components/side-search-section/side-search-section.component';
import { SearchServiceService } from '../../services/search-service.service';
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    ReplaySubject,
    Subscription,
    tap,
} from 'rxjs';
import { SearchSectionComponent } from '../../components/search-section/search-section.component';

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
export class AuctionsSearchPageComponent implements OnInit, OnDestroy {
    private static readonly REQUEST_KEY = '/auctions';
    private readonly subscriptions: Subscription[] = [];
    private readonly requestKeySubject = new ReplaySubject<void>(1);

    public readonly requestKey$ = this.requestKeySubject.asObservable().pipe(
        map(() => AuctionsSearchPageComponent.REQUEST_KEY),
        distinctUntilChanged(),
    );

    constructor(
        private readonly searchService: SearchServiceService,
        private readonly auctionsService: AuctionsService,
        public readonly windowService: WindowService,
    ) {}

    ngOnInit(): void {
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
                .subscribe((params) => {
                    this.auctionsService.set(
                        AuctionsSearchPageComponent.REQUEST_KEY,
                        {
                            queryParameters: params,
                            pageNumber: 1,
                            pageSize: 10,
                            eager: true,
                        },
                    );
                    this.requestKeySubject.next();
                }),
        );
    }

    ngOnDestroy(): void {
        this.requestKeySubject.complete();
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
