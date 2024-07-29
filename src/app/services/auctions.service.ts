import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuctionSummary } from '../models/auction.summary.model';
import { PaginatedRequestParams } from '../helpers/paginatedRequest';
import {
    auctionBuilder,
    auctionSummaryBuilder,
} from '../helpers/builders/auctionBuilder';
import { AuctionSearchParameters } from '../typeUtils/auction.utils';
import { environment } from '../../environments/environment';
import { PaginatedRequestManager } from '../helpers/paginatedRequestManager';
import { map, Observable, Subscription } from 'rxjs';
import { UninterruptedResettableObserver } from '../helpers/uninterruptedResettableObserver';
import { AuctionDTO, AuctionSummaryDTO } from '../DTOs/auction.dto';
import { Auction } from '../models/auction.model';

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

    public constructor(private readonly http: HttpClient) {}

    public set(key: RequestKey, params: auctionsPaginationParams): void {
        const request = this.requestsMap.get(key);
        if (request) {
            request.reset(this.completeParams(params));
        } else {
            this.requestsMap.set(
                key,
                this.createAuctionsRequestManager(params),
            );
        }
    }

    public setIfAbsent(
        key: RequestKey,
        params: auctionsPaginationParams,
    ): void {
        if (this.requestsMap.get(key)) return;
        this.requestsMap.set(key, this.createAuctionsRequestManager(params));
    }

    public subscribeUninterrupted(
        key: RequestKey,
        observer: Partial<UninterruptedResettableObserver<AuctionSummary[]>>,
    ): Subscription {
        return this.getRequest(key).subscribeUninterrupted(observer);
    }

    public elements(key: RequestKey): ReadonlyArray<AuctionSummary> {
        return this.getRequest(key).elements;
    }

    public pageSize(key: RequestKey): number {
        return this.getRequest(key).pageSize;
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

    public remove(key: RequestKey): void {
        this.getRequest(key).clear();
        this.requestsMap.delete(key);
    }

    public getDetails(id: string): Observable<Auction> {
        return this.http
            .get<AuctionDTO>(
                `${environment.backendHost}/auctions/specific/public-view`,
                {
                    params: { id },
                },
            )
            .pipe(map((dto) => auctionBuilder.buildSingle(dto)));
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
        return new PaginatedRequestManager(this.completeParams(params));
    }

    private completeParams(
        params: auctionsPaginationParams,
    ): PaginatedRequestParams<AuctionSummary> {
        return Object.assign(params, {
            http: this.http,
            url: `${environment.backendHost}/auctions/search`,
            factory: (dtos: AuctionSummaryDTO[]) =>
                auctionSummaryBuilder.buildArray(dtos),
        });
    }
}
