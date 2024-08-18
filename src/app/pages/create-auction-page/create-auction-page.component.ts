import {
    Component,
    Inject,
    LOCALE_ID,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    Step,
    StepperComponent,
} from '../../components/stepper/stepper.component';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, Subscription, take } from 'rxjs';
import { RulesetDescription } from '../../models/ruleset-description.model';
import { AuctionCreationRulesetSelectionComponent } from '../../components/auction-creation-ruleset-selection/auction-creation-ruleset-selection.component';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { ButtonModule } from 'primeng/button';
import { AuctionCreationCategorySelectionComponent } from '../../components/auction-creation-category-selection/auction-creation-category-selection.component';
import {
    Categories,
    CategoriesService,
} from '../../services/categories.service';
import { WindowService } from '../../services/window.service';
import { auctionRuleSetsByKind } from '../../helpers/auction-rulesets-by-kind';
import { AuctionKind } from '../../enums/auction-kind.enum';
import { InputComponent } from '../../components/input/input.component';
import { InputTextModule } from 'primeng/inputtext';
import { reactiveFormsUtils } from '../../helpers/reactive-forms-utils';
import { environment } from '../../../environments/environment';
import { ProductConditions } from '../../enums/product-conditions.enum';
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Country } from '../../models/location.model';
import { GeographicalLocationsService } from '../../services/locations.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AsyncPipe, getLocaleCurrencyCode } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { CurrencyDecimalDigitsPipe } from '../../pipes/currency-decimal-digits.pipe';
import { CurrencySymbolPipe } from '../../pipes/currency-symbol.pipe';
import { AuctionRulesetInformationPipe } from '../../pipes/auction-ruleset-information.pipe';

interface auctionCreationDetailsForm {
    title: FormControl<string | null>;
    conditions: FormControl<string | null>;
    description: FormControl<string | null>;
    country: FormControl<string | null>;
    city: FormControl<string | null>;
    startingBid: FormControl<number | null>;
    currency: FormControl<string | null>;
    endDate: FormControl<string | null>;
}

interface auctionCreationForm {
    ruleset: FormControl<AuctionRuleSet | null>;
    category: FormControl<string | null>;
    details: FormGroup<auctionCreationDetailsForm>;
}

@Component({
    selector: 'dd24-create-auction-page',
    standalone: true,
    imports: [
        StepperComponent,
        ReactiveFormsModule,
        ButtonModule,
        AuctionCreationRulesetSelectionComponent,
        AuctionCreationCategorySelectionComponent,
        InputComponent,
        InputTextModule,
        AutoCompleteModule,
        DropdownModule,
        InputTextareaModule,
        InputGroupModule,
        InputNumberModule,
        CurrencyDecimalDigitsPipe,
        CurrencySymbolPipe,
        AuctionRulesetInformationPipe,
        AsyncPipe,
    ],
    templateUrl: './create-auction-page.component.html',
    styleUrl: './create-auction-page.component.scss',
})
export class CreateAuctionPageComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    public readonly environment = environment;

    @ViewChild(StepperComponent) public stepper!: StepperComponent;

    private _activeStep: number = 0;

    public lastReachedStep: number = 0;

    public get activeStep(): number {
        return this._activeStep;
    }

    public set activeStep(value: number) {
        this._activeStep = value;
        if (value > this.lastReachedStep) this.lastReachedStep = value;
    }

    public form!: FormGroup<auctionCreationForm>;

    public error: string = '';

    public steps: Step[] = [
        {
            title: 'Type',
            nextCallback: () =>
                this.checkNext(
                    this.form.controls.ruleset,
                    'Please select a ruleset',
                    this.onNextRuleset.bind(this),
                ),
        },
        {
            title: 'Category',
            nextCallback: () =>
                this.checkNext(
                    this.form.controls.category,
                    'Please select a valid category',
                    this.onNextCategory.bind(this),
                ),
        },
        {
            title: 'Details',
            nextCallback: () => this.checkNext(this.form.controls.details),
        },
        {
            title: 'Pictures',
        },
        {
            title: 'Review',
        },
    ];

    public rulesets: RulesetDescription[] = [];
    private categories: Categories = {};
    private lastValidCategory: string | null = null;
    public conditionsOptions: string[] = Object.values(ProductConditions);

    public isSellingAuction: boolean = false;
    public isProduct: boolean = false;

    public filteredCountries: Country[] = [];

    private cities: string[] = [];
    public filteredCities: string[] = [];

    public currencyCodes: string[] = ['EUR'];

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
        public readonly windowService: WindowService,
        private readonly locationsService: GeographicalLocationsService,
        @Inject(LOCALE_ID) public readonly locale: string,
    ) {}

    public ngOnInit(): void {
        this.subscriptions.push(
            this.windowService.isMobile$.subscribe((isMobile) =>
                this.windowService.setUIvisibility(!isMobile),
            ),
        );

        this.initForm();

        this.route.data.pipe(take(1)).subscribe((data) => {
            this.rulesets = data['rulesets'];
            this.currencyCodes = data['currencyCodes'];
        });

        this.categoriesService.categories$
            .pipe(take(1))
            .subscribe((categories) => {
                this.categories = categories;
            });

        this.subscriptions.push(
            this.form.valueChanges.subscribe(() => {
                if (this.error) this.error = '';
            }),
        );

        this.locationsService.refreshCountries();

        this.onFirstChange(this.form.controls.ruleset, this.next.bind(this));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            ruleset: this.formBuilder.control<AuctionRuleSet | null>(null, [
                Validators.required,
            ]),
            category: this.formBuilder.control<string | null>(null, {
                validators: [this.validateCategory.bind(this)],
                updateOn: 'submit',
            }),
            details: this.formBuilder.group<auctionCreationDetailsForm>({
                title: this.formBuilder.control<string | null>(null, {
                    validators: [Validators.required],
                }),
                conditions: this.formBuilder.control<string | null>(null, {
                    validators: [this.validateConditions.bind(this)],
                }),
                description: this.formBuilder.control<string | null>(null),
                country: this.formBuilder.control<string | null>(null, {
                    validators: [Validators.required],
                }),
                city: this.formBuilder.control<string | null>(null, {
                    validators: [Validators.required],
                }),
                startingBid: this.formBuilder.control<number | null>(null, {
                    validators: [Validators.required],
                }),
                currency: this.formBuilder.control<string | null>(
                    // getLocaleCurrencyCode(this.locale) ??
                    'EUR',
                    {
                        validators: [Validators.required],
                    },
                ),
                endDate: this.formBuilder.control<string | null>(null, {
                    validators: [Validators.required],
                }),
            }),
        });

        this.form.controls.details.controls.city.disable();

        this.subscriptions.push(
            this.form.controls.details.controls.country.valueChanges.subscribe(
                (v) => {
                    const cityControl =
                        this.form.controls.details.controls.city;

                    cityControl.setValue(null);
                    cityControl.markAsUntouched();
                    cityControl.markAsPristine();

                    if (v) {
                        cityControl.enable();
                        this.getCities();
                    } else cityControl.disable();
                },
            ),
        );
    }

    public next(): void {
        this.stepper.nextStep();
    }

    private checkNext(
        control: AbstractControl,
        error?: string,
        cb?: () => void,
    ): boolean {
        if (control.valid) {
            cb?.();
            return true;
        }
        reactiveFormsUtils.markAllAsDirty(control);
        this.error = error ?? '';
        return false;
    }

    private onNextRuleset() {
        this.isSellingAuction =
            auctionRuleSetsByKind
                .get(AuctionKind.selling)
                ?.includes(this.form.controls.ruleset.value!) ?? false;
    }

    private onNextCategory() {
        this.isProduct = this.categoriesService.isProduct(
            this.form.controls.category.value!,
        );
        if (!this.isProduct)
            this.form.controls.details.controls.conditions.setValue(null);
        reactiveFormsUtils.markAllAsPristine(this.form.controls.details);
    }

    private onFirstChange(control: FormControl, cb: () => unknown): void {
        this.subscriptions.push(
            control.valueChanges
                .pipe(
                    filter(() => control.valid),
                    take(1),
                )
                .subscribe(cb),
        );
    }

    private validateCategory(
        control: AbstractControl<string | null>,
    ): ValidationErrors | null {
        if (!control.value) return { required: true };
        if (control.value === this.lastValidCategory) return null;

        const categories = Object.values(this.categories)
            .flat()
            .concat(Object.keys(this.categories));

        const index = categories.findIndex(
            (category) =>
                category.toLowerCase() ===
                this.form.controls.category.value!.toLowerCase(),
        );

        if (index === -1) return { invalid: true };

        this.lastValidCategory = categories[index];
        control.setValue(this.lastValidCategory);

        return null;
    }

    private validateConditions(
        control: AbstractControl<string | null>,
    ): ValidationErrors | null {
        return !this.isProduct || control.value ? null : { required: true };
    }

    public nextIfFirstTime(step: number): void {
        if (this.lastReachedStep === step) {
            this.next();
        }
    }

    private getCities(): void {
        const countryControl = this.form.controls.details.controls.country;
        if (countryControl.valid && countryControl.value) {
            this.locationsService
                .getCities(countryControl.value)
                .subscribe((cities) => {
                    this.cities = cities;
                });
        }
    }

    public completeCountries(event: AutoCompleteCompleteEvent): void {
        this.filteredCountries =
            this.locationsService.countries?.filter((country) =>
                country.name.toLowerCase().includes(event.query.toLowerCase()),
            ) ?? [];
    }

    public completeCities(event: AutoCompleteCompleteEvent): void {
        if (event.query.length < 2) {
            if (this.filteredCities.length > 2) this.filteredCities = [];
            return;
        }

        this.filteredCities = this.cities.filter((city) =>
            city.toLowerCase().includes(event.query.toLowerCase()),
        );
    }
}
