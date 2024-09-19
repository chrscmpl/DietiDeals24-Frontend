import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedRequestParams } from '../helpers/paginated-request';
import { PaginatedRequestManager } from '../helpers/paginated-request-manager';
import { map, Observable, Subscription, switchMap, take } from 'rxjs';
import { UninterruptedResettableObserver } from '../helpers/uninterrupted-resettable-observer';
import { AuctionDTO } from '../DTOs/auction.dto';
import { Auction } from '../models/auction.model';
import { Cacheable } from 'ts-cacheable';
import { AuctionSearchParameters } from '../DTOs/auction-search-parameters.dto';
import { AuctionDeserializer } from '../deserializers/auction.deserializer';
import { defaults, omit } from 'lodash-es';
import { cacheBusters } from '../helpers/cache-busters';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';

export type RequestKey = string;

export type auctionsPaginationParams = Omit<
    PaginatedRequestParams<Auction>,
    'http' | 'deserializer' | 'url' | 'queryParameters' | 'pageNumber'
> & {
    pageNumber?: number;
    queryParameters?: AuctionSearchParameters;
    ownAuctions?: boolean;
    ofUser?: string;
    currentAuctions?: boolean;
    onlyAuctions?: boolean;
    onlyBids?: boolean;
};

type RequestData = {
    manager: PaginatedRequestManager<Auction>;
    ownAuctions: boolean;
    ofUser: string | null;
    currentAuctions: boolean;
    onlyAuctions: boolean;
    onlyBids: boolean;
};

type httpQueryParams = { [key: string]: string | number | boolean };

@Injectable({
    providedIn: 'root',
})
export class AuctionsService {
    private requestsMap = new Map<RequestKey, RequestData>();

    public constructor(
        private readonly http: HttpClient,
        private readonly deserializer: AuctionDeserializer,
        private readonly authentication: AuthenticationService,
    ) {}

    public set(key: RequestKey, params: auctionsPaginationParams): void {
        const request = this.requestsMap.get(key);
        if (request) {
            request.manager.reset(this.completeParams(params));
        } else {
            this.createRequest(key, params);
        }
    }

    public setIfAbsent(
        key: RequestKey,
        params: auctionsPaginationParams,
    ): void {
        if (this.requestsMap.get(key)) return;
        this.createRequest(key, params);
    }

    public subscribeUninterrupted(
        key: RequestKey,
        observer: Partial<UninterruptedResettableObserver<Auction[]>>,
    ): Subscription {
        return this.getRequest(key).manager.subscribeUninterrupted(observer);
    }

    public elements(key: RequestKey): ReadonlyArray<Auction> {
        return this.getRequest(key).manager.elements;
    }

    public pageSize(key: RequestKey): number {
        return this.getRequest(key).manager.pageSize;
    }

    public more(key: RequestKey): void {
        this.getRequest(key).manager.more();
    }

    public refresh(key: RequestKey): void {
        this.getRequest(key).manager.refresh();
    }

    public reset(key: RequestKey): void {
        this.getRequest(key).manager.reset();
    }

    public remove(key: RequestKey): void {
        this.getRequest(key).manager.clear();
        this.requestsMap.delete(key);
    }

    public removeOn(
        predicate: (params: Omit<RequestData, 'manager'>) => boolean,
    ): void {
        for (const [key, value] of this.requestsMap.entries()) {
            if (predicate(value)) {
                value.manager.clear();
                this.requestsMap.delete(key);
            }
        }
    }

    @Cacheable({
        maxCacheCount: 16,
        cacheBusterObserver: cacheBusters.authenticatedUserData$,
    })
    public getDetails(id: string): Observable<Auction> {
        return this.authentication.isLogged$.pipe(
            switchMap((isLogged) => {
                return this.http.get<AuctionDTO>(
                    `auctions/specific/${isLogged ? 'authenticated' : 'guest'}-view`,
                    {
                        params: { id },
                    },
                );
            }),
            map((dto) => this.deserializer.deserialize(dto)),
            take(1),
        );
    }

    private getRequest(key: RequestKey): RequestData {
        const request = this.requestsMap.get(key);
        if (!request) throw new Error(`Auctions Request not found: ${key}`);
        return request;
    }

    private createRequest(
        key: RequestKey,
        params: auctionsPaginationParams,
    ): void {
        if (params.ofUser) {
            this.removeOldUsersRequests(params.ofUser);
        }
        this.requestsMap.set(key, this.createAuctionsRequestData(params));
    }

    private removeOldUsersRequests(userId: string) {
        const otherUsersRequests = Array.from(
            this.requestsMap.entries(),
        ).filter((req) => req[1].ofUser && req[1].ofUser !== userId);

        if (
            otherUsersRequests.length <
            environment.maximumCachedUserAuctionsRequests
        )
            return;

        this.remove(otherUsersRequests[0][0]);
    }

    private createAuctionsRequestData(
        params: auctionsPaginationParams,
    ): RequestData {
        this.validateParams(params);
        return {
            manager: new PaginatedRequestManager(this.completeParams(params)),
            ownAuctions: params.ownAuctions ?? false,
            ofUser: params.ofUser ?? null,
            currentAuctions: params.currentAuctions ?? false,
            onlyAuctions: params.onlyAuctions ?? false,
            onlyBids: params.onlyBids ?? false,
        };
    }

    private validateParams(params: auctionsPaginationParams): void {
        if (
            (params.onlyAuctions && params.onlyBids) ||
            (params.ownAuctions && params.ofUser) ||
            (params.queryParameters &&
                (params.ownAuctions ||
                    params.ofUser ||
                    params.currentAuctions ||
                    params.onlyAuctions ||
                    params.onlyBids))
        )
            throw new Error('Invalid auction search parameters');
    }

    private completeParams(
        params: auctionsPaginationParams,
    ): PaginatedRequestParams<Auction> {
        let url = '';
        let queryParameters: httpQueryParams = {};

        if (params.ownAuctions) {
            url = 'profile/activity/custom/owner-view';
            queryParameters = this.completeParamsForOwnAuctions(params);
        } else if (params.ofUser) {
            url = `profile/activity/${params.currentAuctions ? 'current' : 'past'}-deals/public-view`;
            queryParameters = this.completeParamsForOtherUser(params);
        } else {
            url = 'auctions/search';
            queryParameters = params.queryParameters ?? {};
        }

        return defaults(
            { queryParameters },
            {
                ...params,
                pageNumber: params.pageNumber ?? 1,
                http: this.http,
                deserializer: (dtos: AuctionDTO[]) =>
                    this.deserializer.deserializeArray(dtos),
                url,
            },
        );
    }

    private completeParamsForOwnAuctions(
        params: auctionsPaginationParams,
    ): httpQueryParams {
        return {
            includeCurrentDeals: params.currentAuctions ?? false,
            includePastDeals: !params.currentAuctions,
            includeAuctions: !params.onlyBids,
            includeBids: !params.onlyAuctions,
        };
    }

    private completeParamsForOtherUser(
        params: auctionsPaginationParams,
    ): httpQueryParams {
        const queryParams = {
            id: params.ofUser!,
            includeAuctions: !params.onlyBids,
            includeBids: !params.onlyAuctions,
        };

        if (params.currentAuctions) {
            return omit(queryParams, ['includeAuctions', 'includeBids']);
        }

        return queryParams;
    }
}
