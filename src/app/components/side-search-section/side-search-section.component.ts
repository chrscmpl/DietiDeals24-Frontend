import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionType, SearchPolicy } from '../../typeUtils/auction.utils';
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

interface sideSearchForm {
    policy: FormControl<SearchPolicy | null>;
    type: FormControl<AuctionType | null>;
    category: FormControl<string | null>;
}

@Component({
    selector: 'dd24-side-search-section',
    standalone: true,
    imports: [ReactiveFormsModule, DividerModule, InputSwitchModule],
    templateUrl: './side-search-section.component.html',
    styleUrl: './side-search-section.component.scss',
})
export class SideSearchSectionComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public sideSearchForm!: FormGroup<sideSearchForm>;
    public policiesOptions = SearchPolicy;

    constructor(
        private readonly router: Router,
        private readonly categoriesService: CategoriesService,
        private readonly formBuilder: FormBuilder,
        private readonly searchService: SearchServiceService,
    ) {}

    public ngOnInit(): void {
        this.sideSearchForm = this.formBuilder.group<sideSearchForm>({
            policy: new FormControl<SearchPolicy | null>(null),
            type: new FormControl<AuctionType | null>(null),
            category: new FormControl<string | null>(null),
        });

        this.subscriptions.push(
            this.searchService.validatedSearchParameters$.subscribe(
                (params) => {
                    this.sideSearchForm
                        .get('policy')
                        ?.setValue(params.policy ?? null, { emitEvent: false });
                },
            ),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public onPolicyChange(e: InputSwitchChangeEvent): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.selectPolicy(e.checked as any);
    }

    public selectPolicy(policy: SearchPolicy | null): void {
        this.setQueryParams({ policy });
    }

    public selectType(type: AuctionType | null) {
        this.setQueryParams({ type });
    }

    public selectCategory(category: string | null): void {
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
