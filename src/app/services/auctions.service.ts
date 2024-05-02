import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auction, AuctionSearchParameters } from '../models/auction.model';
import { Observable, ReplaySubject, finalize, of, take } from 'rxjs';
import { PaginationParameters } from '../models/pagination-parameters.model';

export class AuctionsRequest {
    private paginationParameters: PaginationParameters;
    private searchParameters: AuctionSearchParameters;
    private http: HttpClient;
    private eagerSubject: ReplaySubject<Auction[]> = new ReplaySubject<
        Auction[]
    >(1);
    private useEager: boolean = false;

    constructor(
        http: HttpClient,
        searchParameters: AuctionSearchParameters,
        paginationParameters: PaginationParameters,
        eager: boolean,
    ) {
        this.http = http;
        this.searchParameters = searchParameters;
        this.paginationParameters = paginationParameters;
        if (eager) {
            this.useEager = true;
            this.newHttpRequest().subscribe((data) => {
                this.eagerSubject!.next(data);
            });
        }
    }

    private wasMaximumResultsExceeded(): boolean {
        if (!this.paginationParameters.maximumResults) return false;
        return (
            this.paginationParameters.pageNumber *
                this.paginationParameters.pageSize >
            this.paginationParameters.maximumResults
        );
    }

    private newHttpRequest(): Observable<Auction[]> {
        return this.wasMaximumResultsExceeded()
            ? of([])
            : this.http.get<Auction[]>('dd24-backend', {
                  params: {
                      ...this.searchParameters,
                      ...this.paginationParameters,
                  },
              });
    }

    public more(): Observable<Auction[]> {
        if (this.useEager) {
            return this.eagerSubject.asObservable().pipe(
                take(1),
                finalize(() => {
                    this.eagerSubject.complete();
                    this.useEager = false;
                }),
            );
        }
        this.paginationParameters.pageNumber++;
        return this.newHttpRequest();
    }

    // safety net necessary only if the request is eager and no
    // subscriptions to the observable returned by more() where made
    public clear(): void {
        this.eagerSubject.complete();
        this.useEager = false;
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    constructor(private http: HttpClient) {}

    public getAuctionsRequest(
        searchParameters: AuctionSearchParameters,
        paginationParameters: PaginationParameters,
        eager: boolean = true,
    ): AuctionsRequest {
        return new AuctionsRequest(
            this.http,
            searchParameters,
            paginationParameters,
            eager,
        );
    }
}
