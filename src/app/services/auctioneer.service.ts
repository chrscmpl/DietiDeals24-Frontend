import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Observer, throwError } from 'rxjs';
import { CacheBuster } from 'ts-cacheable';
import { AuctionConclusionOptions } from '../enums/auction-conclusion-options.enum';
import { BidAcceptanceException } from '../exceptions/bid-acceptance.exception';
import { BidRejectionException } from '../exceptions/bid-rejection.exception';
import { AuctionCreationData } from '../models/auction-creation-data.model';
import { ToReactiveForm } from '../typeUtils/to-reactive-form';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { Categories, CategoriesService } from './categories.service';
import { UploadedFile } from '../models/uploaded-file.model';
import { AuctionCreationException } from '../exceptions/auction-creation.exception';
import { AuctionCreationSerializer } from '../serializers/auction-creation.serializer';
import { AuctionConclusionData } from '../models/auction-conclusion-data.model';
import { AuctionConclusionSerializer } from '../serializers/auction-conclusion.serializer';
import { cacheBusters } from '../helpers/cache-busters';

type auctionCreationDetailsForm = ToReactiveForm<
    AuctionCreationData['details']
>;

type auctionCreationForm = ToReactiveForm<
    Omit<AuctionCreationData, 'details'>
> & { details: FormGroup<auctionCreationDetailsForm> };

@Injectable({
    providedIn: 'root',
})
export class AuctioneerService {
    private _auctionCreationActiveStep: number = 0;
    private _auctionCreationLastReachedStep: number = 0;

    public get auctionCreationLastReachedStep(): number {
        return this._auctionCreationLastReachedStep;
    }

    public get auctionCreationActiveStep(): number {
        return this._auctionCreationActiveStep;
    }

    public set auctionCreationActiveStep(value: number) {
        this._auctionCreationActiveStep = value;
        if (value > this.auctionCreationLastReachedStep)
            this._auctionCreationLastReachedStep = value;
    }

    private categories!: Categories;
    private lastValidCategory: string | null = null;
    private isAuctionCreationCategoryAProduct: boolean | null = null;

    public readonly auctionCreationForm: FormGroup<auctionCreationForm> =
        this.formBuilder.group<auctionCreationForm>({
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
                endTime: this.formBuilder.control<Date | null>(null, {
                    validators: [Validators.required],
                }),
            }),
            pictures: this.formBuilder.control<UploadedFile[] | null>([]),
        });

    constructor(
        private readonly http: HttpClient,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
        private readonly auctionCreationSerializer: AuctionCreationSerializer,
        private readonly auctionConclusionSerializer: AuctionConclusionSerializer,
    ) {
        this.auctionCreationForm.controls.details.controls.city.disable();

        this.categoriesService.categories$.subscribe((categories) => {
            this.categories = categories;
        });

        this.categoriesService.refreshCategories();

        this.auctionCreationForm.controls.details.controls.country.valueChanges.subscribe(
            (v) => {
                const cityControl =
                    this.auctionCreationForm.controls.details.controls.city;

                cityControl.setValue(null);
                cityControl.markAsUntouched();
                cityControl.markAsPristine();

                if (v) {
                    cityControl.enable();
                } else cityControl.disable();
            },
        );

        this.auctionCreationForm.controls.category.valueChanges.subscribe(
            () => {
                this.isAuctionCreationCategoryAProduct = null;
            },
        );
    }

    public resetAuctionCreation(): void {
        this.auctionCreationForm.reset();
        this.auctionCreationForm.controls.details.controls.city.disable();
        this.isAuctionCreationCategoryAProduct = null;
        this._auctionCreationActiveStep = 0;
        this._auctionCreationLastReachedStep = 0;
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
                category.toLowerCase() === control.value!.toLowerCase(),
        );

        if (index === -1) return { invalid: true };

        this.lastValidCategory = categories[index];
        control.setValue(this.lastValidCategory);

        return null;
    }

    private validateConditions(
        control: AbstractControl<string | null>,
    ): ValidationErrors | null {
        if (this.isAuctionCreationCategoryAProduct === null)
            this.isAuctionCreationCategoryAProduct = this.auctionCreationForm
                ?.controls?.category?.value
                ? this.categoriesService.isProduct(
                      this.auctionCreationForm.controls.category.value,
                  )
                : false;

        return !this.isAuctionCreationCategoryAProduct || control.value
            ? null
            : { required: true };
    }

    public createAuction(
        auction: AuctionCreationData,
        cb?: Partial<Observer<unknown>>,
    ): void {
        this.createAuctionObservable(auction).subscribe(cb);
    }

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.ownActiveAuctions$,
    })
    private createAuctionObservable(
        auction: AuctionCreationData,
    ): Observable<unknown> {
        return this.http
            .post(
                'auctions/new',
                this.auctionCreationSerializer.serialize(auction),
                {
                    responseType: 'text',
                },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new AuctionCreationException(e)),
                ),
            );
    }

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.ownActiveAuctions$,
    })
    public concludeAuction(
        conclusionOptions: AuctionConclusionData,
    ): Observable<unknown> {
        return this.http
            .post(
                'auctions/finalize',
                this.auctionConclusionSerializer.serialize(conclusionOptions),
                {
                    responseType: 'text',
                },
            )
            .pipe(
                catchError((e) =>
                    throwError(() =>
                        conclusionOptions.choice ===
                        AuctionConclusionOptions.accept
                            ? new BidAcceptanceException(e)
                            : new BidRejectionException(e),
                    ),
                ),
            );
    }
}
