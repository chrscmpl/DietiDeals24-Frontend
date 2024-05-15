import { ResolveFn } from '@angular/router';
import { PaginatedRequest } from '../helpers/paginatedRequest';
import { Auction } from '../models/auction.model';
import { inject } from '@angular/core';
import { AuctionsService } from '../services/auctions.service';
import { queryUtils } from '../helpers/queryUtils';

export const auctionsRequestGuard: ResolveFn<
    PaginatedRequest<Auction> | null
> = (route, _) => {
    const query = route.params['query'];
    if (!query) return null;

    return inject(AuctionsService).getAuctionsRequest({
        queryParameters: queryUtils.queryStringToObject(query),
        pageNumber: 1,
        pageSize: 10,
        eager: true,
    });
};
