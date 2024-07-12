import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuctionSummary } from '../models/auction.model';
import {
    PaginatedRequest,
    PaginatedRequestParams,
} from '../helpers/paginatedRequest';
import { auctionBuilder } from '../helpers/auctionBuilder';
import { AuctionSearchParameters } from '../typeUtils/auction.utils';
import { EnvironmentService } from './environment.service';

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    constructor(
        private readonly http: HttpClient,
        private readonly env: EnvironmentService,
    ) {}

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
                url: `${this.env.server}/auctions/search`,
                factory: auctionBuilder.buildArray,
            }),
        );
    }
}
