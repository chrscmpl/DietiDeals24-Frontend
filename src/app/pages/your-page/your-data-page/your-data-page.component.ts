import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { EditUserDataFormComponent } from '../../../components/edit-user-data-form/edit-user-data-form.component';
import { WindowService } from '../../../services/window.service';
import { PaymentMethod } from '../../../models/payment-method.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap, take } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { MaskedPipe } from '../../../pipes/masked.pipe';
import { PaymentMethodLabelPipe } from '../../../pipes/payment-method-label.pipe';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../../services/payment.service';
import { HttpException } from '../../../exceptions/http.exception';
import { PaymentMethodType } from '../../../enums/payment-method-type.enum';
import {
    NewPaymentMethodForm,
    PaymentMethodFormComponent,
} from '../../../components/payment-method-forms/payment-method-form.component';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { UnauthorizedPaymentMethod } from '../../../models/unauthorized-payment-method.model';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';
import { InputComponent } from '../../../components/input/input.component';
import { ToReactiveForm } from '../../../typeUtils/to-reactive-form.type';
import {
    userLink,
    userLinkCreationData,
} from '../../../models/user-link.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { UploadService } from '../../../services/upload.service';
import { ProfilePictureInputComponent } from '../../../components/profile-picture-input/profile-picture-input.component';
import { EditableFieldComponent } from '../../../components/editable-field/editable-field.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete';
import { Country } from '../../../models/country.model';
import { GeographicalLocationsService } from '../../../services/geographical-locations.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { cloneDeep } from 'lodash-es';
import { editableUserData } from '../../../models/editable-user-data.model';

interface publicProfileDataForm {
    username: FormControl<string | null>;
    country: FormControl<string | null>;
    city: FormControl<string | null>;
    bio: FormControl<string | null>;
}

type NewLinkForm = ToReactiveForm<userLinkCreationData>;

interface editYourDataForm {
    publicProfileData: FormGroup<publicProfileDataForm>;
    newLink: FormGroup<NewLinkForm>;
    newPaymentMethod: FormGroup<NewPaymentMethodForm>;
}

@Component({
    selector: 'dd24-your-data-page',
    standalone: true,
    imports: [
        EditUserDataFormComponent,
        ReactiveFormsModule,
        AsyncPipe,
        InputComponent,
        InputTextModule,
        MaskedPipe,
        PaymentMethodLabelPipe,
        ButtonModule,
        InputTextareaModule,
        PaymentMethodFormComponent,
        RouterLink,
        ProfilePictureInputComponent,
        EditableFieldComponent,
        KeyFilterModule,
        AutoCompleteModule,
    ],
    templateUrl: './your-data-page.component.html',
    styleUrl: './your-data-page.component.scss',
})
export class YourDataPageComponent implements OnInit, AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    @ViewChild('countryAutoComplete', { read: ElementRef })
    private countryAutoComplete!: ElementRef;

    public editYourDataForm!: FormGroup<editYourDataForm>;

    public user!: AuthenticatedUser;

    public savedPaymentMethods: PaymentMethod[] = [];

    private originalCountryName!: string;
    private countries: Country[] = [];
    public filteredCountries: Country[] = [];
    private cities: string[] = [];
    public filteredCities: string[] = [];

    public displayLoading = false;

    public readonly environment = environment;

    public readonly tabs: MenuItem[] = [
        {
            label: 'Public profile',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-public-profile'),
        },
        {
            label: 'Links',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-links'),
        },
        {
            label: 'Private area',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-private-area'),
        },
        {
            label: 'Payment methods',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-payment-methods'),
        },
        {
            label: 'Security & Privacy',
            routerLink: ['..', 'security-privacy'],
        },
    ];

    public privateAreaFields: {
        label: string;
        key: keyof AuthenticatedUser;
        type: 'text' | 'date';
    }[] = [
        { label: 'Name', key: 'name', type: 'text' },
        { label: 'Surname', key: 'surname', type: 'text' },
        { label: 'Birthday', key: 'birthday', type: 'date' },
    ];

    public mobileNewLinkFormShown = false;

    public newPaymentMethodFormShown: PaymentMethodType | null = null;

    public newPaymentMethodOptions = Object.values(PaymentMethodType);

    public constructor(
        public readonly windowService: WindowService,
        private readonly route: ActivatedRoute,
        private readonly message: MessageService,
        private readonly paymentService: PaymentService,
        private readonly formBuilder: FormBuilder,
        private readonly confirm: ConfirmationService,
        private readonly authentication: AuthenticationService,
        private readonly upload: UploadService,
        private readonly geographicalLocations: GeographicalLocationsService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.user = data['userData'];
            this.savedPaymentMethods = data['paymentMethods'];
            this.countries = data['countries'];
            this.updateOriginalCountryName();
            this.initForm();
        });
    }

    public ngAfterViewInit(): void {
        this.replaceCountryCodeWithCountryName();
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public saveProfilePicture(file: File) {
        this.upload
            .upload(file)
            .pipe(
                switchMap((uploadedFile) =>
                    this.authentication.editUser({
                        profilePictureUrl: uploadedFile.url,
                    }),
                ),
                switchMap(() => this.authentication.getAuthenticatedUserData()),
                take(1),
            )
            .subscribe({
                next: (userData) => {
                    this.user = userData;
                    this.displaySuccess('Profile picture updated successfully');
                },
                error: (e) =>
                    this.displayError(
                        'Failed to update the profile picture, try again later',
                        e,
                    ),
            });
    }

    public editPublicProfileData(): void {
        if (this.editYourDataForm.controls.publicProfileData.invalid) {
            reactiveFormsUtils.markAllAsDirty(
                this.editYourDataForm.controls.publicProfileData,
            );
            return;
        }

        const dataToEdit = cloneDeep(
            this.editYourDataForm.controls.publicProfileData.value,
        ) as editableUserData;

        for (const entry of Object.entries(dataToEdit)) {
            if (entry[1] === this.user[entry[0] as keyof AuthenticatedUser]) {
                delete dataToEdit[entry[0] as keyof editableUserData];
            }
        }

        if (!Object.keys(dataToEdit).length) return;

        this.authentication
            .editUser(dataToEdit)
            .pipe(
                switchMap(() => this.authentication.getAuthenticatedUserData()),
                take(1),
            )
            .subscribe({
                next: (userData) => {
                    this.user = userData;
                    this.updateOriginalCountryName();
                    this.displaySuccess('Data updated successfully');
                    this.disableControlsOtherThan([]);
                },
                error: (e) =>
                    this.displayError(
                        'Failed to update the data, try again later',
                        e,
                    ),
            });
    }

    public addLink(): void {
        const newLinkForm = this.editYourDataForm.controls.newLink;

        if (!newLinkForm.valid) {
            reactiveFormsUtils.markAllAsDirty(newLinkForm);
            return;
        }

        this.authentication
            .addLink(newLinkForm.value as userLinkCreationData)
            .pipe(
                switchMap(() => this.authentication.getAuthenticatedUserData()),
            )
            .subscribe({
                next: (userData) => {
                    this.mobileNewLinkFormShown = false;
                    newLinkForm.reset();
                    this.user = userData;
                    this.displaySuccess('Link added successfully');
                },
                error: (e) =>
                    this.displayError('Failed to add link, try again later', e),
            });
    }

    public deleteLink(link: userLink): void {
        this.authentication.deleteLink(link.id).subscribe({
            next: () => {
                this.user.links = this.user.links.filter(
                    (l) => l.id !== link.id,
                );
                this.displaySuccess('Link deleted successfully');
            },
            error: (e) =>
                this.displayError('Failed to delete link, try again later', e),
        });
    }

    public promptDeletePaymentMethod(paymentMethod: PaymentMethod): void {
        this.confirm.confirm({
            header: 'Are you sure?',
            message: 'Are you sure you want to delete this payment method?',
            accept: () => this.deletePaymentMethod(paymentMethod),
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptLabel: 'Delete',
            acceptIcon: 'pi pi-trash',
            rejectLabel: 'Go back',
            rejectIcon: 'pi pi-arrow-left',
        });
    }

    private deletePaymentMethod(paymentMethod: PaymentMethod): void {
        this.paymentService
            .deletePaymentMethod(paymentMethod.id)
            .pipe(switchMap(() => this.paymentService.getPaymentMethods()))
            .subscribe({
                next: (paymentMethods) => {
                    this.savedPaymentMethods = paymentMethods;
                    this.displaySuccess('Payment method deleted successfully');
                },
                error: (e) =>
                    this.displayError(
                        'Failed to delete payment method, try again later',
                        e,
                    ),
            });
    }

    public savePaymentMethod(): void {
        const newMethodForm =
            this.editYourDataForm.controls.newPaymentMethod.controls.newMethod;

        if (!newMethodForm) return;

        if (!newMethodForm.valid) {
            reactiveFormsUtils.markAllAsDirty(newMethodForm);
            return;
        }

        const unauthorizedPaymentMethod = UnauthorizedPaymentMethod.from(
            newMethodForm.value,
        );

        if (!unauthorizedPaymentMethod) return;

        this.paymentService
            .authorizePayment(unauthorizedPaymentMethod)
            .pipe(
                switchMap((authorizedPaymentMethod) =>
                    this.paymentService.savePaymentMethod(
                        authorizedPaymentMethod,
                    ),
                ),
                switchMap(() => this.paymentService.getPaymentMethods()),
            )
            .subscribe({
                next: (paymentMethods) => {
                    this.newPaymentMethodFormShown = null;
                    newMethodForm.reset();
                    this.savedPaymentMethods = paymentMethods;
                    this.displaySuccess('Payment method saved successfully');
                },
                error: (e) =>
                    this.displayError(
                        'Failed to save payment method, try again later',
                        e,
                    ),
            });
    }

    private initForm(): void {
        this.editYourDataForm = this.formBuilder.group({
            publicProfileData: this.formBuilder.group<publicProfileDataForm>({
                username: new FormControl<string | null>(this.user.username, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                country: new FormControl<string | null>(this.user.country, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                city: new FormControl<string | null>(this.user.city, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                bio: new FormControl<string | null>(this.user.bio),
            }),
            newLink: this.formBuilder.group<NewLinkForm>({
                name: new FormControl<string | null>(null, {
                    validators: [
                        Validators.required,
                        Validators.maxLength(environment.personalLinkMaxLength),
                    ],
                    updateOn: 'blur',
                }),
                url: new FormControl<string | null>(null, {
                    validators: [
                        Validators.required,
                        Validators.pattern(
                            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
                        ),
                        this.validateUrl.bind(this),
                    ],
                    updateOn: 'blur',
                }),
            }),
            newPaymentMethod: new FormGroup<NewPaymentMethodForm>({}),
        });

        const publicDataForm = this.editYourDataForm.controls.publicProfileData;

        publicDataForm.controls.username.disable();
        publicDataForm.controls.country.disable();
        publicDataForm.controls.city.disable();
        publicDataForm.controls.bio.disable();

        this.subscriptions.push(
            publicDataForm.controls.country.valueChanges.subscribe((value) => {
                this.cities = [];
                this.fetchCities();
                if (
                    value !== this.user.country ||
                    publicDataForm.controls.city.value !== this.user.city
                ) {
                    publicDataForm.controls.city.setValue(null);
                }
                if (!value) publicDataForm.controls.city.disable();
                else publicDataForm.controls.city.enable();
            }),
        );
    }

    public disableControlsOtherThan(fields: (keyof publicProfileDataForm)[]) {
        const publicDataForm = this.editYourDataForm.controls.publicProfileData;

        Object.keys(publicDataForm.controls).forEach((key) => {
            if (!fields.includes(key as keyof publicProfileDataForm)) {
                const control = publicDataForm.get(key);
                if (!control || control.disabled) return;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control.setValue((this.user as any)[key]);
                if (key === 'country') this.replaceCountryCodeWithCountryName();
                control.disable();
            }
        });
    }

    public enableLocationControls(): void {
        this.editYourDataForm.controls.publicProfileData.controls.country.enable();
        this.editYourDataForm.controls.publicProfileData.controls.city.enable();
        this.disableControlsOtherThan(['country', 'city']);
    }

    public disableLocationControls(): void {
        this.editYourDataForm.controls.publicProfileData.controls.country.setValue(
            this.user.country,
        );
        this.editYourDataForm.controls.publicProfileData.controls.city.setValue(
            this.user.city,
        );
        this.editYourDataForm.controls.publicProfileData.controls.country.disable();
        this.editYourDataForm.controls.publicProfileData.controls.city.disable();
        this.replaceCountryCodeWithCountryName();
    }

    public completeCountries(event: AutoCompleteCompleteEvent): void {
        this.filteredCountries =
            this.countries.filter((country) =>
                country.name.toLowerCase().includes(event.query.toLowerCase()),
            ) ?? [];
    }

    public replaceCountryCodeWithCountryName(): void {
        const countryInput =
            this.countryAutoComplete.nativeElement.querySelector(
                '#country-input',
            ) as HTMLInputElement;

        if (countryInput)
            countryInput.value = this.originalCountryName ?? this.user.country;
    }

    public fetchCities() {
        if (this.cities.length) return;

        const countryValue =
            this.editYourDataForm.controls.publicProfileData.controls.country
                .value;

        if (!countryValue) return;

        this.geographicalLocations
            .getCities(countryValue)
            .subscribe((cities) => {
                this.cities = cities;
            });
    }

    public completeCities(event: AutoCompleteCompleteEvent): void {
        this.filteredCities = this.cities.filter((city) =>
            city.toLowerCase().includes(event.query.toLowerCase()),
        );
    }

    private updateOriginalCountryName(): void {
        this.originalCountryName =
            this.countries.find((c) => c.code === this.user.country)?.name ??
            this.user.country;
    }

    private validateUrl(
        urlControl: AbstractControl<string | null>,
    ): ValidationErrors | null {
        return this.user.links.some((link) => link.url === urlControl.value)
            ? { duplicate: true }
            : null;
    }

    private displaySuccess(message: string): void {
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
        });
    }

    private displayError(message: string, error?: HttpException): void {
        if (error?.error?.status === 0) {
            this.message.add({
                severity: 'error',
                summary: 'Network error',
                detail: 'Check your internet connection and try again',
            });
        } else {
            this.message.add({
                severity: 'error',
                summary: 'An error occurred',
                detail: message,
            });
        }
    }
}
