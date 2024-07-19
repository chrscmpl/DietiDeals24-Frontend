import {
    ActivatedRouteSnapshot,
    Resolve,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuctionsService } from '../services/auctions.service';

@Injectable()
export class AuctionsRequestGuard implements Resolve<void> {
    constructor(private auctionsService: AuctionsService) {}

    public resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
        this.auctionsService.create('/auctions', {
            queryParameters: route.queryParams,
            pageNumber: 1,
            pageSize: 10,
            eager: true,
        });
    }
}

export const auctionsRequestGuard: ResolveFn<void> = (r, s) =>
    inject(AuctionsRequestGuard).resolve(r, s);
