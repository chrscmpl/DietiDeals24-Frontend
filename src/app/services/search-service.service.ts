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
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { Nullable } from '../typeUtils/nullable';
import { cloneTruthy } from '../helpers/clone-truthy';
import { AuctionSearchParameters } from '../DTOs/auction-search-parameters.dto';
import { SearchPolicy } from '../enums/search-policy.enum';

@Injectable({
    providedIn: 'root',
})
export class SearchServiceService {
    public readonly validatedSearchParameters$: Observable<
        Readonly<AuctionSearchParameters>
    >;

    private lastSearchParameters: AuctionSearchParameters = {};

    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly route: ActivatedRoute,
        private readonly location: Location,
    ) {
        this.validatedSearchParameters$ = this.route.queryParams.pipe(
            filter(
                () =>
                    this.location.path().startsWith('/auctions') &&
                    !/\([^:]+:[^)]+\)/.test(this.location.path()),
            ),
            withLatestFrom(
                this.categoriesService.categories$.pipe(startWith({})),
            ),
            map(([params, categories]) => {
                const validatedParams = this.getValidatedParams(
                    params,
                    categories,
                );

                this.lastSearchParameters = cloneTruthy(validatedParams);

                this.location.replaceState(
                    this.location.path().split('?')[0],
                    new URLSearchParams(this.lastSearchParameters).toString(),
                );

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

    private validateType(type: string | undefined): AuctionRuleSet | null {
        if (type == this.lastSearchParameters.type)
            return (type as AuctionRuleSet) ?? null;
        if (!type || !Object.keys(AuctionRuleSet).includes(type)) return null;
        return type as AuctionRuleSet;
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

    private validatePolicy(
        policy: SearchPolicy | undefined,
    ): SearchPolicy | null {
        if (policy == this.lastSearchParameters.policy) return policy ?? null;
        if (!policy || !Object.keys(SearchPolicy).includes(policy)) return null;
        return policy as SearchPolicy;
    }
}
