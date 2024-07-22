import { Injectable } from '@angular/core';
import { Categories, CategoriesService } from './categories.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import {
    filter,
    map,
    Observable,
    shareReplay,
    startWith,
    withLatestFrom,
} from 'rxjs';
import {
    AuctionSearchParameters,
    AuctionType,
} from '../typeUtils/auction.utils';
import { Nullable } from '../typeUtils/nullable';
import { cloneTruthy } from '../helpers/cloneTruthy';

@Injectable({
    providedIn: 'root',
})
export class SearchServiceService {
    public readonly updatedSearchParameters$: Observable<
        Readonly<AuctionSearchParameters>
    >;

    private lastSearchParameters: AuctionSearchParameters = {};

    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly route: ActivatedRoute,
        private readonly location: Location,
    ) {
        this.updatedSearchParameters$ = this.route.queryParams.pipe(
            withLatestFrom(this.categoriesService.categories$),
            filter(() => this.location.path().startsWith('/auctions')),
            map(([params, categories]) => {
                const validatedParams = this.getValidatedParams(
                    params,
                    categories,
                );

                this.lastSearchParameters = cloneTruthy(validatedParams);

                return this.lastSearchParameters;
            }),
            startWith(this.lastSearchParameters),
            shareReplay(1),
        );
    }

    private getValidatedParams(
        params: Params,
        categories: Categories,
    ): Nullable<AuctionSearchParameters> {
        return {
            keywords: this.validateKeywords(params['keywords']),
            type: this.validateType(params['type']),
            macroCategory: this.validateMacroCategory(
                params['macroCategory'],
                categories,
            ),
            category: this.validateCategory(params['category'], categories),
            policy: this.validatePolicy(params['policy']),
        };
    }

    private validateKeywords(keywords: string | undefined): string | null {
        if (keywords == this.lastSearchParameters.keywords)
            return keywords ?? null;
        keywords = keywords?.trim();
        if (!keywords || keywords.length === 0) return null;
        return keywords;
    }

    private validateType(type: string | undefined): AuctionType | null {
        if (type == this.lastSearchParameters.type)
            return (type as AuctionType) ?? null;
        if (!type || !Object.keys(AuctionType).includes(type)) return null;
        return type as AuctionType;
    }

    private validateMacroCategory(
        macroCategory: string | undefined,
        categories: Categories,
    ): string | null {
        if (macroCategory == this.lastSearchParameters.macroCategory)
            return macroCategory ?? null;
        if (
            !macroCategory ||
            !Object.keys(categories).includes(macroCategory)
        ) {
            return null;
        }

        return macroCategory;
    }

    private validateCategory(
        category: string | undefined,
        categories: Categories,
    ): string | null {
        if (category == this.lastSearchParameters.category)
            return category ?? null;
        if (!category || !Object.values(categories).flat().includes(category))
            return null;
        return category;
    }

    private validatePolicy(policy: string | undefined): string | null {
        // if (policy == this.lastSearchParameters.policy) return policy ?? null;
        return policy || null;
    }
}
