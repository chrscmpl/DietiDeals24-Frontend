import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {
    catchError,
    map,
    Observable,
    Observer,
    of,
    Subject,
    throwError,
} from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { Auction } from '../models/auction.model';
import { AuctionCreationDTO, AuctionDTO } from '../DTOs/auction.dto';
import { environment } from '../../environments/environment';
import { auctionBuilder } from '../helpers/builders/auction-builder';
import { AuctionConclusionDTO } from '../DTOs/auction-conclusion.dto';
import { AuctionConclusionOptions } from '../enums/auction-conclusion-options.enum';
import { BidAcceptanceException } from '../exceptions/bid-acceptance.exception';
import { BidRejectionException } from '../exceptions/bid-rejection.exception';
import { AuctionCreationData } from '../models/auction-creation-data.model';
import { ToReactiveForm } from '../typeUtils/ToForm';
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

type auctionCreationDetailsForm = ToReactiveForm<
    AuctionCreationData['details']
>;

type auctionCreationForm = ToReactiveForm<
    Omit<AuctionCreationData, 'details'>
> & { details: FormGroup<auctionCreationDetailsForm> };

export const OwnActiveAuctionsCacheBuster$ = new Subject<void>();

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
        private readonly auth: AuthenticationService,
        private readonly formBuilder: FormBuilder,
        private readonly categoriesService: CategoriesService,
    ) {
        this.auth.isLogged$.subscribe(() => {
            OwnActiveAuctionsCacheBuster$.next();
        });

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
        auction: AuctionCreationDTO,
        cb?: Partial<Observer<unknown>>,
    ): void {
        this.createAuctionObservable(auction).subscribe(cb);
    }

    @CacheBuster({
        cacheBusterNotifier: OwnActiveAuctionsCacheBuster$,
    })
    private createAuctionObservable(
        auction: AuctionCreationDTO,
    ): Observable<unknown> {
        return this.http
            .post(`${environment.backendHost}/auctions`, auction)
            .pipe(
                catchError((e) =>
                    throwError(() => new AuctionCreationException(e)),
                ),
            );
    }

    public refreshOwnActiveAuctions(): void {
        this.getOwnActiveAuctions().subscribe();
    }

    @CacheBuster({
        cacheBusterNotifier: OwnActiveAuctionsCacheBuster$,
    })
    public concludeAuction(
        conclusionOptions: AuctionConclusionDTO,
    ): Observable<unknown> {
        return this.http
            .post<unknown>(
                `${environment.backendHost}/conclude`,
                conclusionOptions,
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

    @Cacheable({
        cacheBusterObserver: OwnActiveAuctionsCacheBuster$,
    })
    public getOwnActiveAuctions(): Observable<Auction[]> {
        return this.http
            .get<AuctionDTO[]>(`${environment.backendHost}/auctions/own-active`)
            .pipe(
                map((dtos) => auctionBuilder.buildArray(dtos)),
                catchError(() => of([])),
            );
    }
}
