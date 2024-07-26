import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuctionSummary } from '../models/auction.summary.model';
import { PaginatedRequestParams } from '../helpers/paginatedRequest';
import {
    auctionBuilder,
    auctionSummaryBuilder,
} from '../helpers/builders/auctionBuilder';
import {
    AuctionSearchParameters,
    AuctionStatus,
    AuctionType,
} from '../typeUtils/auction.utils';
import { environment } from '../../environments/environment';
import { PaginatedRequestManager } from '../helpers/paginatedRequestManager';
import { map, Observable, of, Subscription } from 'rxjs';
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
        // return this.http
        //     .get<AuctionDTO>(
        //         `${environment.backendHost}/auctions/specific/public-view`,
        //         {
        //             params: { id },
        //         },
        //     )
        return of({
            id,
            type: AuctionType.silent,
            status: AuctionStatus.active,
            title: 'Iphone 15 Pro Max',
            conditions: 'new',
            country: 'Italy',
            city: 'Milan',
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toString(),
            pictureUrl: undefined,
            currency: 'USD',
            description:
                "Brand new product from Apple sure to blow your expectations what are you even doing if you don't have one like it's 2024 and you are still using a Samsung Galaxy what are you doing with your life you should totally make the brand of phone you use part of your personality and be proud of it" +
                "Brand new product from Apple sure to blow your expectations what are you even doing if you don't have one like it's 2024 and you are still using a Samsung Galaxy what are you doing with your life you should totally make the brand of phone you use part of your personality and be proud of it".toUpperCase() +
                "Brand new product from Apple sure to blow your expectations what are you even doing if you don't have one like it's 2024 and you are still using a Samsung Galaxy what are you doing with your life you should totally make the brand of phone you use part of your personality and be proud of it" +
                "Brand new product from Apple sure to blow your expectations what are you even doing if you don't have one like it's 2024 and you are still using a Samsung Galaxy what are you doing with your life you should totally make the brand of phone you use part of your personality and be proud of it".toUpperCase(),
            bids: undefined,
            username: 'ciccio pasticcio',
            picturesUrls: [
                'https://www.apple.com/v/iphone/home/bv/images/meta/iphone__ky2k6x5u6vue_og.png',
                'https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg',
                'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1693086369818',
            ],
            profilePictureUrl: null,
            category: 'Electronics',
            minimumBid: 1200,
        }).pipe(map((dto) => auctionBuilder.buildSingle(dto)));
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
