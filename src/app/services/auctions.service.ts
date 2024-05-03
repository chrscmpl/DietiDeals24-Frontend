import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Auction,
    AuctionDTO,
    AuctionSearchParameters,
    AuctionType,
    ReverseAuction,
    SilentAuction,
} from '../models/auction.model';
import { Observable, ReplaySubject, finalize, map, of, take } from 'rxjs';
import { PaginationParameters } from '../models/pagination-parameters.model';
import { Money } from '../models/money.model';

export class AuctionsRequest {
    private paginationParameters: PaginationParameters;
    private searchParameters: AuctionSearchParameters;
    private http: HttpClient;
    private eagerSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
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
            this.newRequest().subscribe({
                next: (data) => {
                    this.eagerSubject.next(data);
                },
                error: (error) => this.eagerSubject.next(error),
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

    private getHttpRequest(): Observable<AuctionDTO[]> {
        return this.http.get<AuctionDTO[]>('dd24-backend', {
            params: {
                ...this.searchParameters,
                page: this.paginationParameters.pageNumber,
                pageSize: this.paginationParameters.pageSize,
            },
        });
    }

    private dataToAuctionArray(data: AuctionDTO[]): Auction[] {
        return data.map((auction) => {
            switch (auction.auctionType) {
                case AuctionType.silent:
                    return new SilentAuction(
                        auction as AuctionDTO & {
                            minimumBid: Money;
                        },
                    );
                case AuctionType.reverse:
                    return new ReverseAuction(
                        auction as AuctionDTO & {
                            maximumStartingBid: Money;
                            lowestBid: Money;
                        },
                    );
            }
        });
    }

    private newRequest(): Observable<Auction[]> {
        return this.wasMaximumResultsExceeded()
            ? of([])
            : this.getHttpRequest().pipe(
                  map((data) => this.dataToAuctionArray(data)),
              );
    }

    private get eagerRequest(): Observable<Auction[]> {
        return this.eagerSubject.asObservable().pipe(
            take(1),
            map((data) => {
                if (Array.isArray(data) && data[0] instanceof Auction) {
                    return data;
                }
                throw data;
            }),
            finalize(() => {
                this.eagerSubject.complete();
                this.useEager = false;
            }),
        );
    }

    public more(): Observable<Auction[]> {
        if (this.useEager) {
            return this.eagerRequest;
        }
        this.paginationParameters.pageNumber++;
        return this.newRequest();
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
