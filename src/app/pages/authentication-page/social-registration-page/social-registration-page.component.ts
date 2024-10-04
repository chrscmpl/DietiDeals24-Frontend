import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import {
    catchError,
    map,
    Observable,
    of,
    Subscription,
    switchMap,
    take,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InputComponent } from '../../../components/input/input.component';
import { CalendarModule } from 'primeng/calendar';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { GeographicalLocationsService } from '../../../services/geographical-locations.service';
import { Country } from '../../../models/country.model';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils.helper';
import { UploadService } from '../../../services/upload.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { SocialRegistrationData } from '../../../models/social-registration.model';
import { SocialRegistrationException } from '../../../exceptions/social-registration.exception';
import { MessageService } from 'primeng/api';
import { NavigationService } from '../../../services/navigation.service';
import { BACKEND_REQUEST } from '../../../tokens/backend-request.token';
import {
    Step,
    StepperComponent,
} from '../../../components/stepper/stepper.component';
import { WindowService } from '../../../services/window.service';
import { DialogModule } from 'primeng/dialog';
import { AssetsService } from '../../../services/assets.service';
import { CheckboxModule } from 'primeng/checkbox';

interface CompleteUserDataForm {
    username: FormControl<string | null>;
    name: FormControl<string | null>;
    surname: FormControl<string | null>;
    birthday: FormControl<Date | null>;
    country: FormControl<string | null>;
    city: FormControl<string | null>;
}

interface privacyPolicyForm {
    accept: FormControl<boolean>;
}

interface SocialRegistrationForm {
    userData: FormGroup<CompleteUserDataForm>;
    privacyPolicy: FormGroup<privacyPolicyForm>;
}

@Component({
    selector: 'dd24-social-registration-page',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        AutoCompleteModule,
        KeyFilterModule,
        InputComponent,
        CalendarModule,
        ReactiveFormsModule,
        StepperComponent,
        DialogModule,
        CheckboxModule,
    ],
    templateUrl: './social-registration-page.component.html',
    styleUrl: './social-registration-page.component.scss',
})
export class SocialRegistrationPageComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    public user!: SocialUser;
    public submissionLoading: boolean = false;
    public socialRegistrationForm!: FormGroup<SocialRegistrationForm>;
    public activeStep: number = 0;
    public error: string = '';
    @ViewChild(StepperComponent) public stepper!: StepperComponent;

    public readonly environment = environment;

    private countries: Country[] = [];
    public filteredCountries: Country[] = [];

    private cities: string[] = [];
    public filteredCities: string[] = [];

    public minBirthdayDate: Date = new Date(1900, 0, 1);
    public maxBirthdayDate: Date = new Date();
    public defaultBirthdayDate: Date = new Date(2000, 0, 1);

    private onNextuserData = (): boolean => {
        if (!this.socialRegistrationForm.controls.userData.valid) {
            reactiveFormsUtils.markAllAsDirty(
                this.socialRegistrationForm.controls.userData,
            );
            return false;
        }
        return true;
    };

    public steps: Step[] = [
        {
            title: 'Your data',
            nextCallback: this.onNextuserData.bind(this),
        },
        {
            title: 'Privacy policy',
        },
    ];

    public privacyPolicyDialogVisible: boolean = false;

    public tos: string = '';

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly http: HttpClient,
        private readonly formBuilder: FormBuilder,
        private readonly locationsService: GeographicalLocationsService,
        private readonly upload: UploadService,
        private readonly authentication: AuthenticationService,
        private readonly navigation: NavigationService,
        private readonly message: MessageService,
        private readonly windowService: WindowService,
        private readonly assets: AssetsService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.user = data['user'];
            this.initForm();
            this.handleCityControl();
        });

        this.maxBirthdayDate.setFullYear(
            this.maxBirthdayDate.getFullYear() - 18,
        );

        this.locationsService
            .getCountries()
            .pipe(take(1))
            .subscribe((countries) => {
                this.countries = countries;
            });

        this.subscriptions.push(
            this.windowService.isMobile$.subscribe((isMobile) => {
                this.navigation.backAction = isMobile
                    ? this.onBack.bind(this)
                    : null;
            }),
        );

        this.assets
            .getPlainText('tos.txt')
            .pipe(take(1))
            .subscribe((tos) => {
                this.tos = tos;
            });
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.navigation.backAction = null;
    }

    public next(): void {
        this.stepper.nextStep();
    }

    private onBack(defaultFn: () => void): void {
        if (this.activeStep > 0) this.stepper.prevStep();
        else defaultFn();
    }

    public onSubmit(): void {
        if (this.activeStep !== this.steps.length - 1) {
            this.next();
            return;
        }

        this.onRegister();
    }

    private onRegister(): void {
        if (!this.socialRegistrationForm.valid) {
            reactiveFormsUtils.markAllAsDirty(this.socialRegistrationForm);
            this.error = 'You must accept the privacy policy to continue';
            return;
        }

        this.submissionLoading = true;

        this.authentication
            .registerUsingSocials({
                socialUser: this.user,
                ...this.socialRegistrationForm.controls.userData.value,
            } as SocialRegistrationData)
            .pipe(
                switchMap(() => this.uploadUserPicture()),
                switchMap((url) => {
                    if (url) {
                        return this.authentication
                            .editUser({
                                profilePictureUrl: url,
                            })
                            .pipe(catchError(() => of(null)));
                    }
                    return of(null);
                }),
            )
            .subscribe({
                next: () => this.onRegistrationSuccess(),
                error: (e) => this.onRegistrationError(e),
            });
    }

    private onRegistrationSuccess(): void {
        this.submissionLoading = false;
        this.navigation.navigateToRouteBeforeRedirection();
    }

    private onRegistrationError(e: SocialRegistrationException): void {
        this.submissionLoading = false;
        if (e.error.status > 500) {
            this.message.add({
                severity: 'error',
                summary: 'Server error',
                detail: 'An error occurred on the server. Please try again later',
            });
        } else if (e.error.status === 0) {
            this.message.add({
                severity: 'error',
                summary: 'Network error',
                detail: 'Check your connection and try again',
            });
        } else if (e.error.status === 409) {
            this.message.add({
                severity: 'error',
                summary: 'Usernames already in use',
                detail: 'Please try again',
            });
        } else {
            this.message.add({
                severity: 'error',
                summary: 'An error occurred',
                detail: 'Please try again',
            });
        }
    }

    private initForm(): void {
        this.socialRegistrationForm =
            this.formBuilder.group<SocialRegistrationForm>({
                userData: this.formBuilder.group<CompleteUserDataForm>({
                    username: new FormControl<string | null>(null, {
                        validators: [Validators.required],
                        updateOn: 'blur',
                    }),
                    name: new FormControl<string | null>(
                        this.user.firstName ?? null,
                        {
                            validators: [Validators.required],
                            updateOn: 'blur',
                        },
                    ),
                    surname: new FormControl<string | null>(
                        this.user.lastName ?? null,
                        {
                            validators: [Validators.required],
                            updateOn: 'blur',
                        },
                    ),
                    birthday: new FormControl<Date | null>(null, {
                        validators: [Validators.required],
                    }),
                    country: new FormControl<string | null>(null, {
                        validators: Validators.required,
                    }),
                    city: new FormControl<string | null>(null, {
                        validators: Validators.required,
                    }),
                }),
                privacyPolicy: this.formBuilder.group<privacyPolicyForm>({
                    accept: new FormControl<boolean>(false, {
                        validators: [Validators.requiredTrue],
                        nonNullable: true,
                    }),
                }),
            });
        this.socialRegistrationForm.controls.userData.controls.city.disable();
    }

    private uploadUserPicture(): Observable<string | null> {
        return this.http
            .get(this.user.photoUrl, {
                responseType: 'blob',
                context: new HttpContext().set(BACKEND_REQUEST, false),
            })
            .pipe(
                map((blob) => {
                    const fileName = `${this.user.id}.${blob.type.split('/')[1]}`;
                    return new File([blob], fileName, { type: blob.type });
                }),
                switchMap((file) => this.upload.upload(file)),
                map((uploadedFile) => uploadedFile.url),
                catchError(() => of(null)),
                take(1),
            );
    }

    private handleCityControl(): void {
        this.socialRegistrationForm.controls.userData.controls.country.valueChanges.subscribe(
            (v) => {
                const cityControl =
                    this.socialRegistrationForm.controls.userData.controls.city;

                cityControl.setValue(null);
                cityControl.markAsUntouched();
                cityControl.markAsPristine();

                if (v) {
                    cityControl.enable();
                    this.getCities();
                } else cityControl.disable();
            },
        );
    }

    private getCities(): void {
        const countryControl =
            this.socialRegistrationForm.controls.userData.controls.country;
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
        this.filteredCities = this.cities.filter((city) =>
            city.toLowerCase().includes(event.query.toLowerCase()),
        );
    }
}
