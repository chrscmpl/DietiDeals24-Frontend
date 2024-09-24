import { Injectable } from '@angular/core';
import { Categories, CategoriesService } from './categories.service';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import {
    distinctUntilChanged,
    filter,
    map,
    Observable,
    shareReplay,
    startWith,
    switchMap,
    take,
    withLatestFrom,
} from 'rxjs';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { Nullable } from '../type-utils/nullable.type';
import { AuctionSearchParameters } from '../DTOs/auction-search-parameters.dto';
import { SearchPolicy } from '../enums/search-policy.enum';
import { isEqual, isNil, omitBy } from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    public readonly validatedSearchParameters$: Observable<
        Readonly<AuctionSearchParameters>
    >;

    private lastSearchParameters: AuctionSearchParameters = {};

    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly router: Router,
    ) {
        this.validatedSearchParameters$ = this.router.events.pipe(
            filter(
                (event) =>
                    event instanceof NavigationEnd &&
                    /^\/auctions(\?.*)?$/.test(event.urlAfterRedirects),
            ),
            switchMap(() => this.route.queryParams.pipe(take(1))),
            distinctUntilChanged(isEqual),
            withLatestFrom(
                this.categoriesService.categories$.pipe(startWith({})),
            ),
            map(([params, categories]) => {
                const validatedParams = this.getValidatedParams(
                    params,
                    categories,
                );

                this.lastSearchParameters = omitBy(validatedParams, isNil);

                this.location.replaceState(
                    this.location.path().split('?')[0],
                    new URLSearchParams(this.lastSearchParameters).toString(),
                );

                return this.lastSearchParameters;
            }),
            startWith(this.lastSearchParameters),
            distinctUntilChanged(isEqual),
            shareReplay(1),
        );
        this.validatedSearchParameters$.subscribe();
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
