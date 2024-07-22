import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DropdownModule } from 'primeng/dropdown';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { CategorySelectionComponent } from './category-selection/category-selection.component';
import { Router } from '@angular/router';
import { Nullable } from '../../typeUtils/nullable';
import {
    AuctionSearchParameters,
    AuctionType,
} from '../../typeUtils/auction.utils';
import { CategoriesService } from '../../services/categories.service';
import { Subscription } from 'rxjs';
import { SearchServiceService } from '../../services/search-service.service';

interface searchForm {
    keywords: FormControl<string | null>;
    type: FormControl<AuctionType | null>;
    category: FormControl<string | null>;
}

interface option {
    name: string;
    value: string | null;
}

@Component({
    selector: 'dd24-search-section',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        DropdownModule,
        OneCharUpperPipe,
        CategorySelectionComponent,
    ],
    templateUrl: './search-section.component.html',
    styleUrl: './search-section.component.scss',
})
export class SearchSectionComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public searchForm!: FormGroup<searchForm>;

    public auctionTypeOptions: option[] = [
        { name: 'All auctions', value: null },
    ];

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly oneCharUpperPipe: OneCharUpperPipe,
        private readonly router: Router,
        private readonly categoriesService: CategoriesService,
        private readonly searchService: SearchServiceService,
    ) {}

    public ngOnInit(): void {
        this.searchForm = this.formBuilder.group<searchForm>({
            keywords: new FormControl<string | null>(null),
            type: new FormControl<AuctionType | null>(null),
            category: new FormControl<string | null>(null),
        });

        this.auctionTypeOptions = this.auctionTypeOptions.concat(
            Object.values(AuctionType).map((type) => {
                return {
                    name: `${this.oneCharUpperPipe.transform(type)} auctions`,
                    value: type as string,
                };
            }),
        );

        this.subscriptions.push(
            this.searchService.validatedSearchParameters$.subscribe(
                (params) => {
                    this.searchForm
                        .get('keywords')
                        ?.setValue(params.keywords ?? null);
                    this.searchForm
                        .get('type')
                        ?.setValue((params.type as AuctionType) ?? null);
                    this.searchForm
                        .get('category')
                        ?.setValue(
                            params.category ?? params.macroCategory ?? null,
                        );
                },
            ),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public handleSubmit(): void {
        let params: Nullable<AuctionSearchParameters> = this.searchForm.value;
        if (
            params.category &&
            this.categoriesService.macroCategories?.includes(params.category)
        ) {
            const { category, ...rest } = params;
            params = {
                ...rest,
                macroCategory: category,
            };
        }

        this.router.navigate(['/auctions'], {
            queryParams: params,
        });
    }
}
