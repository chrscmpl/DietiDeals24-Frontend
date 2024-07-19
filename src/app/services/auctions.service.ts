import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuctionSummary } from '../models/auction.model';
import { PaginatedRequestParams } from '../helpers/paginatedRequest';
import { auctionBuilder } from '../helpers/auctionBuilder';
import { AuctionSearchParameters } from '../typeUtils/auction.utils';
import { environment } from '../../environments/environment';
import { PaginatedRequestManager } from '../helpers/paginatedRequestManager';
import { filter, Observable, Subject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestKey = string;

export type auctionsPaginationParams = Omit<
    PaginatedRequestParams<AuctionSummary>,
    'http' | 'factory' | 'url' | 'queryParameters'
> & {
    queryParameters: AuctionSearchParameters;
};

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    private requestsMap = new Map<
        RequestKey,
        PaginatedRequestManager<AuctionSummary>
    >();

    private newRequestSubject = new Subject<RequestKey>();
    private _newRequest$ = this.newRequestSubject.asObservable();

    public constructor(private readonly http: HttpClient) {}

    public newRequest$(key: RequestKey): Observable<RequestKey> {
        return this._newRequest$.pipe(filter((k) => k === key));
    }

    public create(key: RequestKey, params: auctionsPaginationParams): void {
        const request = this.requestsMap.get(key);
        if (request) {
            request.complete();
            this.newRequestSubject.next(key);
        }
        this.requestsMap.set(key, this.createAuctionsRequestManager(params));
    }

    public elements(key: RequestKey): ReadonlyArray<AuctionSummary> {
        return this.getRequest(key).elements;
    }

    public data$(key: RequestKey): Observable<AuctionSummary[]> {
        return this.getRequest(key).data$;
    }

    public loadingEnded$(key: RequestKey): Observable<void> {
        return this.getRequest(key).loadingEnded$;
    }

    public more(key: RequestKey): void {
        this.getRequest(key).more();
    }

    public refresh(key: RequestKey): void {
        this.getRequest(key).refresh();
    }

    public reset(key: RequestKey): void {
        this.getRequest(key).reset();
    }

    private getRequest(
        key: RequestKey,
    ): PaginatedRequestManager<AuctionSummary> {
        const request = this.requestsMap.get(key);
        if (!request) throw new Error(`Auctions Request not found: ${key}`);
        return request;
    }

    private createAuctionsRequestManager(
        params: auctionsPaginationParams,
    ): PaginatedRequestManager<AuctionSummary> {
        return new PaginatedRequestManager(
            Object.assign(params, {
                http: this.http,
                url: `${environment.backendHost}/auctions/search`,
                factory: auctionBuilder.buildArray,
            }),
        );
    }
}
