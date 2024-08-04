import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
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
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { CategoriesService } from '../../services/categories.service';
import { filter, Subscription, take } from 'rxjs';
import { SearchServiceService } from '../../services/search-service.service';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { WindowService } from '../../services/window.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SearchPolicy } from '../../enums/search-policy.enum';
import { AuctionSearchParameters } from '../../DTOs/auction-search-parameters.dto';

interface searchForm {
    keywords: FormControl<string | null>;
    type: FormControl<AuctionRuleSet | null>;
    category: FormControl<string | null>;
    policy: FormControl<SearchPolicy | null>;
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
        AsyncPipe,
        NgTemplateOutlet,
        InputSwitchModule,
    ],
    templateUrl: './search-section.component.html',
    styleUrl: './search-section.component.scss',
})
export class SearchSectionComponent implements OnInit, OnDestroy {
    @ViewChild('keywordsInput') keywordsInput!: ElementRef<HTMLInputElement>;

    private subscriptions: Subscription[] = [];
    public searchForm!: FormGroup<searchForm>;

    public auctionTypeOptions: option[] = [
        { name: 'All auctions', value: null },
    ];

    public policyOptions = SearchPolicy;

    public displayNoneExtraControls: boolean = true;
    public showExtraControls: boolean = false;
    public renderExtraControls: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly oneCharUpperPipe: OneCharUpperPipe,
        private readonly router: Router,
        private readonly categoriesService: CategoriesService,
        private readonly searchService: SearchServiceService,
        public readonly windowService: WindowService,
    ) {}

    public ngOnInit(): void {
        this.searchForm = this.formBuilder.group<searchForm>({
            keywords: new FormControl<string | null>(null),
            type: new FormControl<AuctionRuleSet | null>(null),
            category: new FormControl<string | null>(null),
            policy: new FormControl<SearchPolicy | null>(null),
        });

        this.auctionTypeOptions = this.auctionTypeOptions.concat(
            Object.values(AuctionRuleSet).map((type) => {
                return {
                    name: `${this.oneCharUpperPipe.transform(type)} auctions`,
                    value: type as string,
                };
            }),
        );

        this.subscriptions = this.subscriptions.concat([
            this.searchService.validatedSearchParameters$.subscribe(
                (params) => {
                    this.searchForm
                        .get('keywords')
                        ?.setValue(params.keywords ?? null);
                    this.searchForm
                        .get('type')
                        ?.setValue((params.type as AuctionRuleSet) ?? null);
                    this.searchForm
                        .get('category')
                        ?.setValue(
                            params.category ?? params.macroCategory ?? null,
                        );
                    this.searchForm
                        .get('policy')
                        ?.setValue(params.policy ?? null);
                },
            ),
            this.windowService.isMobile$
                .pipe(filter((isMobile) => !isMobile))
                .subscribe(() => {
                    this.showExtraControls = true;
                    this.renderExtraControls = true;
                    this.displayNoneExtraControls = false;
                    this.searchForm.get('policy')?.setValue(null);
                }),
        ]);
    }

    public ngOnDestroy(): void {
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

    public submitIfMobile() {
        this.windowService.isMobile$.pipe(take(1)).subscribe((isMobile) => {
            if (isMobile) this.handleSubmit();
        });
    }

    public toggleExtraControls() {
        if (this.renderExtraControls === false) this.renderExtraControls = true;
        if (this.showExtraControls) {
            this.showExtraControls = false;
            setTimeout(() => {
                if (this) this.displayNoneExtraControls = true;
            }, 60);
            return;
        }
        this.displayNoneExtraControls = false;
        this.showExtraControls = true;
    }

    public focusKeywordsInput() {
        this.keywordsInput?.nativeElement?.focus();
    }
}
