import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedRequestParams } from '../helpers/paginated-request';
import { PaginatedRequestManager } from '../helpers/paginated-request-manager';
import { map, Observable, Subscription } from 'rxjs';
import { UninterruptedResettableObserver } from '../helpers/uninterrupted-resettable-observer';
import { AuctionDTO } from '../DTOs/auction.dto';
import { Auction } from '../models/auction.model';
import { Cacheable } from 'ts-cacheable';
import { AuctionSearchParameters } from '../DTOs/auction-search-parameters.dto';
import { AuctionDeserializer } from '../deserializers/auction.deserializer';
import { defaults } from 'lodash-es';

export type RequestKey = string;

export type auctionsPaginationParams = Omit<
    PaginatedRequestParams<Auction>,
    'http' | 'deserializer' | 'url' | 'queryParameters'
> & {
    queryParameters?: AuctionSearchParameters;
    ownAuctions?: boolean;
    ofUser?: string;
    currentAuctions?: boolean;
    onlyAuctions?: boolean;
    onlyBids?: boolean;
};

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    private requestsMap = new Map<
        RequestKey,
        PaginatedRequestManager<Auction>
    >();

    public constructor(
        private readonly http: HttpClient,
        private readonly deserializer: AuctionDeserializer,
    ) {}

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
        observer: Partial<UninterruptedResettableObserver<Auction[]>>,
    ): Subscription {
        return this.getRequest(key).subscribeUninterrupted(observer);
    }

    public elements(key: RequestKey): ReadonlyArray<Auction> {
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

    @Cacheable({ maxCacheCount: 16 })
    public getDetails(id: string): Observable<Auction> {
        return this.http
            .get<AuctionDTO>(`auctions/specific/public-view`, {
                params: { id },
            })
            .pipe(map((dto) => this.deserializer.deserialize(dto)));
    }

    private getRequest(key: RequestKey): PaginatedRequestManager<Auction> {
        const request = this.requestsMap.get(key);
        if (!request) throw new Error(`Auctions Request not found: ${key}`);
        return request;
    }

    private createAuctionsRequestManager(
        params: auctionsPaginationParams,
    ): PaginatedRequestManager<Auction> {
        return new PaginatedRequestManager(this.completeParams(params));
    }

    private completeParams(
        params: auctionsPaginationParams,
    ): PaginatedRequestParams<Auction> {
        this.validateParams(params);

        let url = 'auctions/search';
        let queryParameters: { [key: string]: string | number | boolean } = {};

        if (params.ownAuctions) {
            url = 'profile/activity/custom/owner-view';
            queryParameters['includeCurrentDeals'] =
                params.currentAuctions ?? false;
            queryParameters['includePastDeals'] = !params.currentAuctions;
            queryParameters['includeAuctions'] = !params.onlyBids;
            queryParameters['includeBids'] = !params.onlyAuctions;
        } else if (params.ofUser) {
            url = `profile/activity/${params.currentAuctions ? 'current' : 'past'}-deals/public-view`;
            queryParameters['id'] = params.ofUser;
        }

        if (Object.keys(queryParameters).length === 0)
            queryParameters = params.queryParameters ?? {};

        return defaults(
            { queryParameters },
            {
                ...params,
                http: this.http,
                deserializer: (dtos: AuctionDTO[]) =>
                    this.deserializer.deserializeArray(dtos),
                url,
            },
        );
    }

    private validateParams(params: auctionsPaginationParams): void {
        if (
            (params.onlyAuctions && params.onlyBids) ||
            (params.ownAuctions && params.ofUser) ||
            (params.queryParameters &&
                (params.ownAuctions ||
                    params.ofUser ||
                    params.currentAuctions ||
                    params.onlyAuctions ||
                    params.onlyBids))
        )
            throw new Error('Invalid auction search parameters');
    }
}
