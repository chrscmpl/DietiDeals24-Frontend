import {
    Component,
    ElementRef,
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
import { auctionRuleSetsByKind } from '../../helpers/auction-rulesets-by-kind.helper';
import { AuctionKind } from '../../enums/auction-kind.enum';
import { InputComponent } from '../../components/input/input.component';
import { InputTextModule } from 'primeng/inputtext';
import { reactiveFormsUtils } from '../../helpers/reactive-forms-utils.helper';
import { environment } from '../../../environments/environment';
import { ProductConditions } from '../../enums/product-conditions.enum';
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Country } from '../../models/country.model';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavigationService } from '../../services/navigation.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AuctionCreationData } from '../../models/auction-creation-data.model';
import { AuctionCreationException } from '../../exceptions/auction-creation.exception';

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
        KeyFilterModule,
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

    public get activeStep(): number {
        return this.auctioneerService.auctionCreationActiveStep;
    }

    public set activeStep(value: number) {
        if (value !== this.auctioneerService.auctionCreationActiveStep) {
            this.error = '';
            this.auctioneerService.auctionCreationActiveStep = value;
        }
    }

    public get lastReachedStep(): number {
        return this.auctioneerService.auctionCreationLastReachedStep;
    }

    public form = this.auctioneerService.auctionCreationForm;

    public error: string = '';

    public submissionLoading: boolean = false;

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
                    this.form.controls.details,
                    '',
                    this.onNextDetails.bind(this),
                ),
        },
        {
            title: 'Pictures',
            nextCallback: this.checkNextPictures.bind(this),
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

    private countries: Country[] = [];
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

    private acceptedProgressingWithNoPictures: boolean = false;

    public previewPictureUrls: { url: string; id: number }[] = [];

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        public readonly auctioneerService: AuctioneerService,
        private readonly categoriesService: CategoriesService,
        public readonly windowService: WindowService,
        private readonly locationsService: GeographicalLocationsService,
        private readonly confirmationService: ConfirmationService,
        private readonly message: MessageService,
        private readonly element: ElementRef,
        private readonly navigation: NavigationService,
        @Inject(LOCALE_ID) public readonly locale: string,
    ) {}

    public ngOnInit(): void {
        this.initPageState();

        this.subscriptions.push(
            this.windowService.isMobile$.subscribe((isMobile) => {
                this.windowService.setUIvisibility(!isMobile);
                this.navigation.backAction = isMobile
                    ? this.onBack.bind(this)
                    : null;
            }),
        );

        this.subscriptions.push(
            this.form.controls.details.controls.country.valueChanges.subscribe(
                (v) => {
                    if (v) this.getCities();
                },
            ),
        );

        this.subscriptions.push(
            this.form.controls.pictures.valueChanges.subscribe(
                this.updatePreviewPictureUrls.bind(this),
            ),
        );

        this.route.data.pipe(take(1)).subscribe((data) => {
            this.rulesets = data['rulesets'];
            this.currencyCodes = data['currencyCodes'];
        });

        this.locationsService
            .getCountries()
            .pipe(take(1))
            .subscribe((countries) => {
                this.countries = countries;
            });

        this.subscriptions.push(
            this.form.valueChanges.subscribe(() => {
                if (this.error) this.error = '';
            }),
        );

        this.onFirstChange(this.form.controls.ruleset, this.next.bind(this));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.navigation.backAction = null;
    }

    private initPageState(): void {
        if (this.form.controls.ruleset.valid) this.onNextRuleset();

        if (this.form.controls.category.valid) this.onNextCategory();

        if (this.form.controls.details.valid) this.onNextDetails();

        if (this.form.controls.details.controls.country.valid) this.getCities();

        this.updatePreviewPictureUrls();
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

    private next(): void {
        this.stepper.nextStep();
    }

    private onBack(defaultFn: () => void): void {
        if (this.activeStep > 0) this.stepper.prevStep();
        else defaultFn();
    }

    public onSubmit(): void {
        if (this.activeStep < this.steps.length - 1) this.next();
        else this.onAuctionCreation();
    }

    private onAuctionCreation(): void {
        this.submissionLoading = true;
        this.auctioneerService.createAuction(
            this.form.value as AuctionCreationData,
            {
                next: this.onAuctionCreationSuccess.bind(this),
                error: this.onAuctionCreationError.bind(this),
            },
        );
    }

    private onAuctionCreationSuccess(): void {
        this.submissionLoading = false;
        this.router.navigate(['']).then(() => {
            this.message.add({
                severity: 'success',
                summary: 'Auction created',
                detail: 'The auction was successfully created, you can find it in your personal page',
            });
            this.auctioneerService.resetAuctionCreation();
        });
    }

    private onAuctionCreationError(e: AuctionCreationException): void {
        this.submissionLoading = false;
        if (e?.error?.status === 0) {
            this.message.add({
                severity: 'error',
                summary: 'Network error',
                detail: 'Check your connection and try again',
            });
        } else {
            this.message.add({
                severity: 'error',
                summary: 'An error occurred',
                detail: 'An error occurred while creating the auction, try again later',
            });
        }
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
            this.countries.find(
                (country) =>
                    country.code ===
                    this.form.controls.details.controls.country.value,
            )?.name ??
            this.form.controls.details.controls.country.value ??
            '';
    }

    private checkNextPictures(): boolean {
        if (
            this.form.controls.pictures.value?.length ||
            this.acceptedProgressingWithNoPictures
        )
            return true;
        else
            this.confirmationService.confirm({
                header: 'No pictures',
                message:
                    'Auctions with at least one picture are more likely to receive bids. Are you sure you want to continue without adding pictures?',
                accept: () => {
                    this.acceptedProgressingWithNoPictures = true;
                    this.next();
                },
                reject: () => {
                    this.element.nativeElement
                        .querySelector('.p-fileupload-choose')
                        ?.click?.();
                },
                acceptLabel: 'Continue',
                rejectLabel: 'Add pictures',
                defaultFocus: 'reject',
                acceptButtonStyleClass: 'p-button-outlined',
                rejectIcon: 'pi pi-image',
                acceptIcon: 'pi pi-arrow-right',
            });

        return false;
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
            this.cities = [];
            this.filteredCities = [];
            this.locationsService
                .getCities(countryControl.value)
                .subscribe((cities) => {
                    this.cities = cities;
                });
        }
    }

    public completeCountries(event: AutoCompleteCompleteEvent): void {
        this.filteredCountries =
            this.countries.filter((country) =>
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

    private updatePreviewPictureUrls(): void {
        this.previewPictureUrls =
            this.form.controls.pictures.value?.map((file) => ({
                url: URL.createObjectURL(file.file),
                id: file.id,
            })) ?? [];
    }
}
