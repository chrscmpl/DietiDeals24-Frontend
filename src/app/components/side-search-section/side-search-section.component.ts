import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    AuctionSearchParameters,
    AuctionType,
    SearchPolicy,
} from '../../typeUtils/auction.utils';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { Subscription, take } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { SearchServiceService } from '../../services/search-service.service';
import { CheckboxModule } from 'primeng/checkbox';

interface sideSearchForm {
    policy: FormControl<SearchPolicy | null>;
    types: FormControl<AuctionType[] | null>;
    category: FormControl<string | null>;
}

@Component({
    selector: 'dd24-side-search-section',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DividerModule,
        InputSwitchModule,
        CheckboxModule,
    ],
    templateUrl: './side-search-section.component.html',
    styleUrl: './side-search-section.component.scss',
})
export class SideSearchSectionComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public sideSearchForm!: FormGroup<sideSearchForm>;
    public policyControl!: FormControl<SearchPolicy | null>;
    public typesControl!: FormControl<AuctionType[] | null>;
    public categoryControl!: FormControl<string | null>;

    public policiesOptions = SearchPolicy;
    public typesOptions = AuctionType;

    constructor(
        private readonly router: Router,
        private readonly categoriesService: CategoriesService,
        private readonly formBuilder: FormBuilder,
        private readonly searchService: SearchServiceService,
    ) {}

    public ngOnInit(): void {
        this.policyControl = new FormControl<SearchPolicy | null>(null);
        this.typesControl = new FormControl<AuctionType[] | null>([]);
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
            params.type ? [params.type] : Object.values(AuctionType),
            { emitEvent: false },
        );
    }

    public onPolicyChange(e: InputSwitchChangeEvent): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.selectPolicy(e.checked as any);
    }

    public onTypeChange(interactedValue: AuctionType): void {
        if (!this.typesControl.value || this.typesControl.value.length === 0) {
            this.typesControl.setValue([interactedValue]);
        } else {
            this.selectType(
                this.typesControl.value.length > 1
                    ? null
                    : this.typesControl.value[0],
            );
        }
    }

    private selectPolicy(policy: SearchPolicy | null): void {
        this.setQueryParams({
            policy: policy === SearchPolicy.trending ? null : policy,
        });
    }

    private selectType(type: AuctionType | null) {
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
}
