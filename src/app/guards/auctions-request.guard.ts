import {
    ActivatedRouteSnapshot,
    Resolve,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';
import { PaginatedRequest } from '../helpers/paginatedRequest';
import { Auction } from '../models/auction.model';
import { Injectable, inject } from '@angular/core';
import { AuctionsService } from '../services/auctions.service';
import { queryUtils } from '../helpers/queryUtils';

@Injectable()
export class AuctionsRequestGuard
    implements Resolve<PaginatedRequest<Auction> | null>
{
    constructor(private auctionsService: AuctionsService) {}

    public resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
        const query = route.params['query'];
        if (!query) return null;

        return this.auctionsService.getAuctionsRequest({
            queryParameters: queryUtils.queryStringToObject(query),
            pageNumber: 1,
            pageSize: 10,
            eager: true,
        });
    }
}

export const auctionsRequestGuard: ResolveFn<
    PaginatedRequest<Auction> | null
> = (r, s) => inject(AuctionsRequestGuard).resolve(r, s);
