import {
    ActivatedRouteSnapshot,
    Resolve,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';
import { PaginatedRequest } from '../helpers/paginatedRequest';
import { AuctionSummary } from '../models/auction.model';
import { Injectable, inject } from '@angular/core';
import { AuctionsService } from '../services/auctions.service';

@Injectable()
export class AuctionsRequestGuard
    implements Resolve<PaginatedRequest<AuctionSummary>>
{
    constructor(private auctionsService: AuctionsService) {}

    public resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
        return this.auctionsService.getAuctionsRequest({
            queryParameters: route.queryParams,
            pageNumber: 1,
            pageSize: 10,
            eager: true,
        });
    }
}

export const auctionsRequestGuard: ResolveFn<
    PaginatedRequest<AuctionSummary>
> = (r, s) => inject(AuctionsRequestGuard).resolve(r, s);
