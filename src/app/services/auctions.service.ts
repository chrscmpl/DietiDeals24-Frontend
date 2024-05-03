import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auction, AuctionSearchParameters } from '../models/auction.model';
import {
    PaginatedRequest,
    PaginationParameters,
} from '../helpers/paginatedRequest';
import { auctionBuilder } from '../helpers/auctionBuilder';

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    constructor(private http: HttpClient) {}

    public getAuctionsRequest(
        searchParameters: AuctionSearchParameters,
        paginationParameters: PaginationParameters,
    ): PaginatedRequest<Auction> {
        return new PaginatedRequest<Auction>(
            this.http,
            'dd24-backend/auctions',
            auctionBuilder.buildArray,
            searchParameters,
            paginationParameters,
        );
    }
}
