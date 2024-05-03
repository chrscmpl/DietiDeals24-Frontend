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
        eager: boolean = false,
    ): PaginatedRequest<Auction> {
        return new PaginatedRequest<Auction>(
            this.http,
            'dd24-backend/auctions',
            auctionBuilder.buildArray,
            searchParameters,
            paginationParameters,
            eager,
        );
    }
}
