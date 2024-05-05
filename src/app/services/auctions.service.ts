import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auction, AuctionSearchParameters } from '../models/auction.model';
import {
    PaginatedRequest,
    PaginatedRequestParams,
} from '../helpers/paginatedRequest';
import { auctionBuilder } from '../helpers/auctionBuilder';

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    constructor(private http: HttpClient) {}

    public getAuctionsRequest(
        params: Omit<
            PaginatedRequestParams<Auction>,
            'http' | 'factory' | 'url' | 'queryParameters'
        > & {
            queryParameters: AuctionSearchParameters;
        },
    ): PaginatedRequest<Auction> {
        return new PaginatedRequest<Auction>(
            Object.assign(params, {
                http: this.http,
                url: 'dd24-backend/auctions',
                factory: auctionBuilder.buildArray,
            }),
        );
    }
}
