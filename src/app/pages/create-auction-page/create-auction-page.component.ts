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
    FormControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subscription, take } from 'rxjs';
import { RulesetDescription } from '../../models/ruleset-description.model';
import { AuctionCreationRulesetSelectionComponent } from '../../components/auction-creation-ruleset-selection/auction-creation-ruleset-selection.component';

import { ButtonModule } from 'primeng/button';
import { AuctionCreationCategorySelectionComponent } from '../../components/auction-creation-category-selection/auction-creation-category-selection.component';
import { CategoriesService } from '../../services/categories.service';
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
import { GeographicalLocationsService } from '../../services/geographical-locations.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { CurrencyDecimalDigitsPipe } from '../../pipes/currency-decimal-digits.pipe';
import { CurrencySymbolPipe } from '../../pipes/currency-symbol.pipe';
import { AuctionRulesetInformationPipe } from '../../pipes/auction-ruleset-information.pipe';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { AuctionRuleSetLinkComponent } from '../../components/auction-ruleset-link/auction-ruleset-link.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { AuctioneerService } from '../../services/auctioneer.service';
import { UploaderComponent } from '../../components/uploader/uploader.component';

@Component({
    selector: 'dd24-create-auction-page',
    standalone: true,
    imports: [
        StepperComponent,
        ReactiveFormsModule,
        ButtonModule,
        AuctionCreationRulesetSelectionComponent,
        AuctionCreationCategorySelectionComponent,
        UploaderComponent,
        TimerComponent,
        InputComponent,
        AuctionRuleSetLinkComponent,
        InputTextModule,
        AutoCompleteModule,
        DropdownModule,
        InputTextareaModule,
        InputGroupModule,
        InputNumberModule,
        CalendarModule,
        DividerModule,
        CurrencyDecimalDigitsPipe,
        CurrencySymbolPipe,
        CurrencyPipe,
        AuctionRulesetInformationPipe,
        LocalDatePipe,
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

    public form = this.auctioneerService.auctionCreationForm;

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
            nextCallback: () =>
                this.checkNext(
                    //this.form.controls.details,
                    this.form.controls.category,
                    '',
                    this.onNextDetails.bind(this),
                ),
        },
        {
            title: 'Pictures',
        },
        {
            title: 'Review',
        },
    ];

    public rulesets: RulesetDescription[] = [];
    public conditionsOptions: string[] = Object.values(ProductConditions);

    public isSellingAuction: boolean = false;
    public isMacroCategory: boolean = false;
    public isProduct: boolean = false;

    public filteredCountries: Country[] = [];

    private cities: string[] = [];
    public filteredCities: string[] = [];

    public currencyCodes: string[] = ['EUR'];

    public minEndTime: Date = this.getFutureDate(
        environment.auctionMinDuration,
    );
    public maxEndTime: Date = this.getFutureDate(
        environment.auctionMaxDuration,
    );
    public defaultEndTime: Date = this.minEndTime;

    public countryInternationalName: string = '';

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        public readonly auctioneerService: AuctioneerService,
        private readonly categoriesService: CategoriesService,
        public readonly windowService: WindowService,
        private readonly locationsService: GeographicalLocationsService,
        @Inject(LOCALE_ID) public readonly locale: string,
    ) {}

    public ngOnInit(): void {
        this.initPageState();

        this.subscriptions.push(
            this.windowService.isMobile$.subscribe((isMobile) =>
                this.windowService.setUIvisibility(!isMobile),
            ),
        );

        this.subscriptions.push(
            this.form.controls.details.controls.country.valueChanges.subscribe(
                (v) => {
                    if (v) this.getCities();
                },
            ),
        );

        this.route.data.pipe(take(1)).subscribe((data) => {
            this.rulesets = data['rulesets'];
            this.currencyCodes = data['currencyCodes'];
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

    private initPageState(): void {
        if (this.form.controls.ruleset.valid) this.onNextRuleset();

        if (this.form.controls.category.valid) this.onNextCategory();

        if (this.form.controls.details.valid) this.onNextDetails();

        if (this.form.controls.details.controls.country.valid) this.getCities();

        this.advanceWhileTrue([
            this.form.controls.ruleset.valid,
            this.form.controls.category.valid,
            this.form.controls.details.valid,
            !!this.form.controls.pictures.value?.length,
        ]);
    }

    public showPreview(): void {
        this.router.navigate(
            [
                '',
                {
                    outlets: {
                        overlay: ['auction-preview'],
                    },
                },
            ],
            {
                skipLocationChange: true,
                state: {
                    auctionPreviewData: this.form.value,
                },
            },
        );
    }

    public next(): void {
        this.stepper.nextStep();
    }

    private advanceWhileTrue(conditions: boolean[]): void {
        let i = 0;
        while (i < conditions.length && conditions[i]) i++;
        this.activeStep = i;
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
        const category: string = this.form.controls.category.value!;

        this.isProduct = this.categoriesService.isProduct(category);
        this.isMacroCategory = this.categoriesService.isMacroCategory(category);

        if (!this.isProduct)
            this.form.controls.details.controls.conditions.setValue(null);

        reactiveFormsUtils.markAllAsPristine(this.form.controls.details);
    }

    private onNextDetails() {
        this.countryInternationalName =
            this.locationsService.countries?.find(
                (country) =>
                    country.code ===
                    this.form.controls.details.controls.country.value,
            )?.name ??
            this.form.controls.details.controls.country.value ??
            '';
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

    private getFutureDate(milliseconds: number): Date {
        const date = new Date();
        date.setTime(date.getTime() + milliseconds);
        return date;
    }
}
