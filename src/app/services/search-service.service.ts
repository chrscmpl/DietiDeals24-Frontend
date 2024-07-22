import { Injectable } from '@angular/core';
import { Categories, CategoriesService } from './categories.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, withLatestFrom } from 'rxjs';
import {
    AuctionSearchParameters,
    AuctionType,
} from '../typeUtils/auction.utils';

@Injectable({
    providedIn: 'root',
})
export class SearchServiceService {
    public readonly updatedSearchParameters$: Observable<AuctionSearchParameters>;

    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly route: ActivatedRoute,
        private readonly location: Location,
    ) {
        this.updatedSearchParameters$ = this.route.queryParams.pipe(
            withLatestFrom(this.categoriesService.categories$),
            filter(() => this.location.path().startsWith('/auctions')),
            map(
                ([params, categories]) =>
                    ({
                        keywords: this.validateKeywords(params['keywords']),
                        type: this.validateType(params['type']),
                        macroCategory: this.validateMacroCategory(
                            params['macroCategory'],
                            categories,
                        ),
                        category: this.validateCategory(
                            params['category'],
                            categories,
                        ),
                        policy: this.validatePolicy(params['policy']),
                    }) as AuctionSearchParameters,
            ),
        );
    }

    private validateKeywords(keywords: string | undefined): string | null {
        keywords = keywords?.trim();
        if (!keywords || keywords.length === 0) return null;
        return keywords;
    }

    private validateType(type: string | undefined): AuctionType | null {
        if (!type || !Object.keys(AuctionType).includes(type)) return null;
        return type as AuctionType;
    }

    private validateMacroCategory(
        macroCategory: string | undefined,
        categories: Categories,
    ): string | null {
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
        if (!category || !Object.values(categories).flat().includes(category))
            return null;
        return category;
    }

    private validatePolicy(policy: string | undefined): string | null {
        return policy || null;
    }
}
