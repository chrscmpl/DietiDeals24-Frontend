import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
    Step,
    StepperComponent,
} from '../../../components/stepper/stepper.component';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete';
import { InputComponent } from '../../../components/input/input.component';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { GeographicalLocationsService } from '../../../services/geographical-locations.service';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthenticationService } from '../../../services/authentication.service';
import { Country } from '../../../models/country.model';
import { environment } from '../../../../environments/environment';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils.helper';
import { MessageService } from 'primeng/api';
import { AssetsService } from '../../../services/assets.service';
import { Subject, Subscription, take, throttleTime } from 'rxjs';
import { RegistrationException } from '../../../exceptions/registration.exception';
import { NavigationService } from '../../../services/navigation.service';
import { WindowService } from '../../../services/window.service';
import { omit } from 'lodash-es';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UserRegistrationData } from '../../../models/user-registration-data.model';

interface userDataForm {
    name: FormControl<string | null>;
    surname: FormControl<string | null>;
    birthday: FormControl<Date | null>;
    country: FormControl<string | null>;
    city: FormControl<string | null>;
}

interface credentialsForm {
    email: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}

interface privacyPolicyForm {
    accept: FormControl<boolean>;
}

interface registrationForm {
    userData: FormGroup<userDataForm>;
    credentials: FormGroup<credentialsForm>;
    privacyPolicy: FormGroup<privacyPolicyForm>;
}

@Component({
    selector: 'dd24-registration-page',
    standalone: true,
    imports: [
        StepperComponent,
        ButtonModule,
        InputTextModule,
        InputComponent,
        ReactiveFormsModule,
        RouterLink,
        CalendarModule,
        DividerModule,
        AutoCompleteModule,
        PasswordModule,
        DialogModule,
        CheckboxModule,
        KeyFilterModule,
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private next$ = new Subject<void>();
    @ViewChild(StepperComponent) public stepper!: StepperComponent;

    public registrationForm!: FormGroup<registrationForm>;
    public activeStep: number = 0;
    public error: string = '';

    private countries: Country[] = [];
    public filteredCountries: Country[] = [];

    private cities: string[] = [];
    public filteredCities: string[] = [];

    public minBirthdayDate: Date = new Date(1900, 0, 1);
    public maxBirthdayDate: Date = new Date();
    public defaultBirthdayDate: Date = new Date(2000, 0, 1);

    public privacyPolicyDialogVisible: boolean = false;

    public tos: string = '';

    public get environment(): typeof environment {
        return environment;
    }

    private onNextuserData = (): boolean => {
        if (!this.registrationForm.get('userData')?.valid) {
            reactiveFormsUtils.markAllAsDirty(
                this.registrationForm.get('userData') as FormGroup,
            );
            return false;
        }
        return true;
    };

    private onNextCredentials = (): boolean => {
        if (!this.registrationForm.get('credentials')?.valid) {
            reactiveFormsUtils.markAllAsDirty(
                this.registrationForm.get('credentials') as FormGroup,
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
            title: 'Your credentials',
            nextCallback: this.onNextCredentials.bind(this),
        },
        {
            title: 'Privacy policy',
        },
    ];

    public submissionLoading: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        public readonly locationsService: GeographicalLocationsService,
        private readonly router: Router,
        private readonly authentication: AuthenticationService,
        private readonly message: MessageService,
        public readonly assets: AssetsService,
        private readonly navigation: NavigationService,
        private readonly windowService: WindowService,
    ) {}

    public ngOnInit(): void {
        this.initForm();

        this.maxBirthdayDate.setFullYear(
            this.maxBirthdayDate.getFullYear() - 18,
        );

        this.locationsService
            .getCountries()
            .pipe(take(1))
            .subscribe((countries) => {
                this.countries = countries;
            });

        this.assets
            .getPlainText('tos.txt')
            .pipe(take(1))
            .subscribe((tos) => {
                this.tos = tos;
            });

        this.handleCityControl();

        this.subscriptions.push(
            this.windowService.isMobile$.subscribe((isMobile) => {
                this.navigation.backAction = isMobile
                    ? this.onBack.bind(this)
                    : null;
            }),
        );

        this.subscriptions.push(
            this.next$.pipe(throttleTime(100)).subscribe(() => {
                this.stepper.nextStep();
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.navigation.backAction = null;
        this.next$.complete();
    }

    private initForm(): void {
        this.registrationForm = this.formBuilder.group<registrationForm>({
            userData: this.formBuilder.group<userDataForm>({
                name: new FormControl<string | null>(null, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                surname: new FormControl<string | null>(null, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
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
            credentials: this.formBuilder.group<credentialsForm>({
                email: new FormControl<string | null>(null, {
                    validators: [Validators.required, Validators.email],
                    updateOn: 'blur',
                }),
                username: new FormControl<string | null>(null, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                password: new FormControl<string | null>(null, {
                    validators: [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(environment.passwordPattern),
                    ],
                    updateOn: 'blur',
                }),
                confirmPassword: new FormControl<string | null>(null, {
                    validators: [
                        Validators.required,
                        this.validateConfirmPassword.bind(this),
                    ],
                    updateOn: 'blur',
                }),
            }),
            privacyPolicy: this.formBuilder.group<privacyPolicyForm>({
                accept: new FormControl<boolean>(false, {
                    nonNullable: true,
                    validators: Validators.requiredTrue,
                }),
            }),
        });

        this.registrationForm.controls.userData.controls.city.disable();
    }

    private handleCityControl(): void {
        this.registrationForm.controls.userData.controls.country.valueChanges.subscribe(
            (v) => {
                const cityControl =
                    this.registrationForm.controls.userData.controls.city;

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

    public next(): void {
        this.next$.next();
    }

    private onBack(defaultFn: () => void): void {
        if (this.activeStep > 0) this.stepper.prevStep();
        else defaultFn();
    }

    public onSubmit(): void {
        if (this.activeStep !== 2) {
            this.next();
            return;
        }

        this.onRegister();
    }

    public googleSignIn(): void {
        this.message.add({
            severity: 'info',
            summary: 'Not implemented',
            detail: 'Google sign in is not implemented at this time',
        });
    }

    private onRegister(): void {
        reactiveFormsUtils.forceValidation(
            this.registrationForm.controls.credentials.controls.confirmPassword,
        );
        if (!this.registrationForm.valid) {
            this.onInvalidForm();
            return;
        }

        this.submissionLoading = true;

        this.error = '';

        const newUser = omit(
            {
                ...this.registrationForm.value.userData,
                ...this.registrationForm.value.credentials,
            },
            ['confirmPassword'],
        );

        this.authentication.register(newUser as UserRegistrationData, {
            next: this.onRegisterSuccess.bind(this),
            error: this.onRegisterError.bind(this),
        });
    }

    private onInvalidForm(): void {
        reactiveFormsUtils.markAllAsDirty(this.registrationForm);
        if (this.registrationForm.get('privacyPolicy')?.invalid)
            this.error = 'You must accept the privacy policy to continue';
    }

    private onRegisterSuccess(): void {
        this.authentication.emailToVerify =
            this.registrationForm.get('credentials')?.get('email')?.value ??
            null;
        this.router.navigate(['auth/verify-email']);
    }

    private onRegisterError(e: RegistrationException): void {
        this.submissionLoading = false;
        if (e.error.status >= 500) {
            this.showErrorToast('Server error', 'Please try again later.');
        } else if (e.error.status === 409) {
            this.showErrorToast(
                'Conflict',
                'Email or username already in use.',
            );
        } else if (e.error.status >= 400) {
            this.showErrorToast(
                'Invalid data',
                'Please check your data and try again.',
            );
        } else if (e.error.status === 0) {
            this.showErrorToast(
                'Network error',
                'Check your connection and try again',
            );
        } else {
            this.showErrorToast('An error occurred', 'Please try again later.');
        }
        console.error(e.error);
    }

    public onKeyPressed(event: KeyboardEvent): void {
        if (event.key === 'Enter') this.onSubmit();
    }

    private getCities(): void {
        const countryControl =
            this.registrationForm.controls.userData.controls.country;
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
            this.countries.filter((country) =>
                country.name.toLowerCase().includes(event.query.toLowerCase()),
            ) ?? [];
    }

    public completeCities(event: AutoCompleteCompleteEvent): void {
        this.filteredCities = this.cities.filter((city) =>
            city.toLowerCase().includes(event.query.toLowerCase()),
        );
    }

    public setDialogVisibility(e: Event): void {
        if (
            e instanceof MouseEvent ||
            (e instanceof KeyboardEvent && e.key === 'Enter')
        )
            this.privacyPolicyDialogVisible = true;
    }

    private validateConfirmPassword(
        control: AbstractControl<string>,
    ): ValidationErrors {
        const passwordControl = this.registrationForm
            ?.get('credentials')
            ?.get('password');
        if (control.value === passwordControl?.value) return {};
        return { passwordsDoNotMatch: true };
    }

    private showErrorToast(header: string, content: string): void {
        this.message.add({
            severity: 'error',
            summary: header,
            detail: content,
        });
    }
}
