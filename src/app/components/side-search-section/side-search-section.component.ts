import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { map, Observable, Subscription, take } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { SearchService } from '../../services/search-service.service';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { AsyncPipe } from '@angular/common';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { SearchPolicy } from '../../enums/search-policy.enum';
import { AuctionSearchParameters } from '../../DTOs/auction-search-parameters.dto';

interface sideSearchForm {
    policy: FormControl<SearchPolicy | null>;
    types: FormControl<AuctionRuleSet[] | null>;
    category: FormControl<string | null>;
}

@Component({
    selector: 'dd24-side-search-section',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        OneCharUpperPipe,
        DividerModule,
        InputSwitchModule,
        CheckboxModule,
        PanelMenuModule,
    ],
    templateUrl: './side-search-section.component.html',
    styleUrl: './side-search-section.component.scss',
})
export class SideSearchSectionComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public sideSearchForm!: FormGroup<sideSearchForm>;
    public policyControl!: FormControl<SearchPolicy | null>;
    public typesControl!: FormControl<AuctionRuleSet[] | null>;
    public categoryControl!: FormControl<string | null>;

    public readonly policiesOptions = SearchPolicy;
    public readonly typesOptions = Object.values(AuctionRuleSet);

    public categoryItems$: Observable<MenuItem[]> =
        this.categoriesService.categories$.pipe(
            map((categories) => {
                return Object.entries(categories).map(([key, value]) => {
                    return {
                        label: this.oneCharUpperPipe.transform(key),
                        items: value.map((category) => {
                            return {
                                label: category,
                            };
                        }),
                    };
                });
            }),
        );

    constructor(
        private readonly router: Router,
        private readonly categoriesService: CategoriesService,
        private readonly formBuilder: FormBuilder,
        private readonly searchService: SearchService,
        private readonly oneCharUpperPipe: OneCharUpperPipe,
    ) {}

    public ngOnInit(): void {
        this.policyControl = new FormControl<SearchPolicy | null>(null);
        this.typesControl = new FormControl<AuctionRuleSet[] | null>([]);
        this.categoryControl = new FormControl<string | null>(null);

        this.sideSearchForm = this.formBuilder.group<sideSearchForm>({
            policy: this.policyControl,
            types: this.typesControl,
            category: this.categoryControl,
        });

        this.subscriptions.push(
            this.searchService.validatedSearchParameters$.subscribe(
                this.updateValues.bind(this),
            ),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    private updateValues(params: AuctionSearchParameters): void {
        this.policyControl.setValue(params.policy ?? null, {
            emitEvent: false,
        });

        this.typesControl.setValue(
            params.type ? [params.type] : Object.values(AuctionRuleSet),
            { emitEvent: false },
        );

        this.categoryControl.setValue(
            params.category ?? params.macroCategory ?? null,
            { emitEvent: false },
        );
    }

    public onPolicyChange(e: InputSwitchChangeEvent): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.selectPolicy(e.checked as any);
    }

    public onTypeChange(interactedValue: AuctionRuleSet): void {
        if (!this.typesControl.value || this.typesControl.value.length === 0) {
            this.typesControl.setValue([interactedValue]);
        } else {
            this.selectType(
                this.typesControl.value.length === this.typesOptions.length
                    ? null
                    : this.typesControl.value.join(','),
            );
        }
    }

    public onCategoryChange(category: string | null): void {
        this.selectCategory(category);
    }

    private selectPolicy(policy: SearchPolicy | null): void {
        this.setQueryParams({
            policy: policy === SearchPolicy.trending ? null : policy,
        });
    }

    private selectType(type: string | null) {
        this.setQueryParams({ type });
    }

    private selectCategory(category: string | null): void {
        if (category === null) {
            this.setQueryParams({ category: null, macroCategory: null });
            return;
        }
        this.categoriesService.categories$
            .pipe(take(1))
            .subscribe((categories) => {
                if (Object.keys(categories).includes(category))
                    this.setQueryParams({
                        macroCategory: category,
                        category: null,
                    });
                else
                    this.setQueryParams({
                        category: category,
                        macroCategory: null,
                    });
            });
    }

    private setQueryParams(params: Record<string, string | null>): void {
        this.router.navigate([], {
            queryParams: params,
            queryParamsHandling: 'merge',
        });
    }

    public onCategoryItemKeyPress(
        category: string | null,
        e: KeyboardEvent,
    ): void {
        if (e.key === 'Enter') {
            this.selectCategory(category);
        }
    }
}
