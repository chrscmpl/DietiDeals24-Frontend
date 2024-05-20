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
import { Observable, ReplaySubject, Subscription, startWith, take } from 'rxjs';

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
    public searchForm!: FormGroup<searchForm>;

    private macroCategoriesSubject = new ReplaySubject<string[]>(1);

    private macroCategories$: Observable<string[]> =
        this.macroCategoriesSubject.asObservable();

    private subscriptions: Subscription[] = [];

    public auctionTypeOptions: option[] = [
        { name: 'All auctions', value: null },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private oneCharUpperPipe: OneCharUpperPipe,
        private router: Router,
        private categoriesService: CategoriesService,
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

        this.macroCategoriesSubject.next([]);

        this.subscriptions.push(
            this.categoriesService.macroCategories$.subscribe(
                (macroCategories) => {
                    this.macroCategoriesSubject.next(macroCategories);
                },
            ),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.macroCategoriesSubject.complete();
    }

    public handleSubmit(): void {
        this.macroCategories$.subscribe((macroCategories) => {
            let params: Nullable<AuctionSearchParameters> =
                this.searchForm.value;
            if (params.category && macroCategories.includes(params.category)) {
                const { category, ...rest } = params;
                params = {
                    ...rest,
                    macroCategory: category,
                };
            }
            this.router
                .navigateByUrl('/redirect', { skipLocationChange: true })
                .then(() => {
                    this.router.navigate(['/auctions'], {
                        queryParams: params,
                    });
                });
        });
    }
}
