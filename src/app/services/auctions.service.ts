import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuctionSummary } from '../models/auction.model';
import {
    PaginatedRequest,
    PaginatedRequestParams,
} from '../helpers/paginatedRequest';
import { auctionBuilder } from '../helpers/auctionBuilder';
import { AuctionSearchParameters } from '../typeUtils/auction.utils';

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    constructor(private http: HttpClient) {}

    public getAuctionsRequest(
        params: Omit<
            PaginatedRequestParams<AuctionSummary>,
            'http' | 'factory' | 'url' | 'queryParameters'
        > & {
            queryParameters: AuctionSearchParameters;
        },
    ): PaginatedRequest<AuctionSummary> {
        return new PaginatedRequest<AuctionSummary>(
            Object.assign(params, {
                http: this.http,
                url: 'dd24-backend/auctions',
                factory: auctionBuilder.buildArray,
            }),
        );
    }
}
