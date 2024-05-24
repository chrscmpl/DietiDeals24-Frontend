import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
    Step,
    StepperComponent,
} from '../../components/stepper/stepper.component';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete';
import { InputComponent } from '../../components/input/input.component';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { LocationsService } from '../../services/locations.service';
import { PasswordModule } from 'primeng/password';

interface anagraphicsForm {
    name: FormControl<string | null>;
    surname: FormControl<string | null>;
    birthday: FormControl<string | null>;
    country: FormControl<string | null>;
    city: FormControl<string | null>;
}

interface credentialsForm {
    email: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}

interface registrationForm {
    anagraphics: FormGroup<anagraphicsForm>;
    credentials: FormGroup<credentialsForm>;
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
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent implements OnInit {
    public registrationForm!: FormGroup<registrationForm>;
    public activeStep: number = 0;

    public filteredCountries: string[] = [];

    private cities: string[] = [];
    public filteredCities: string[] = [];

    public mediumPasswordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?=.{8,})';
    public strongPasswordRegex =
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)(?=.{12,})';

    private onNextAnagraphics = (): boolean => {
        if (!this.registrationForm.get('anagraphics')?.valid) {
            this.registrationForm.get('anagraphics')?.markAllAsTouched();
            return false;
        }
        return true;
    };

    private onNextCredentials = (): boolean => {
        if (!this.registrationForm.get('credentials')?.valid) {
            this.registrationForm.get('credentials')?.markAllAsTouched();
            return false;
        }
        return true;
    };

    public steps: Step[] = [
        {
            title: 'Your data',
            nextCallback: this.onNextAnagraphics,
        },
        {
            title: 'Your credentials',
            nextCallback: this.onNextCredentials,
        },
        {
            title: 'Privacy policy',
        },
    ];

    constructor(
        private formBuilder: FormBuilder,
        public locationsService: LocationsService,
    ) {}

    ngOnInit(): void {
        this.locationsService.refreshCountries();
        this.registrationForm = this.formBuilder.group<registrationForm>({
            anagraphics: this.formBuilder.group<anagraphicsForm>({
                name: new FormControl(null, [Validators.required]),
                surname: new FormControl(null, [Validators.required]),
                birthday: new FormControl(null, [Validators.required]),
                country: new FormControl(null, {
                    validators: this.validateCountry.bind(this),
                    updateOn: 'blur',
                }),
                city: new FormControl(null, {
                    validators: this.validateCity.bind(this),
                    updateOn: 'blur',
                }),
            }),
            credentials: this.formBuilder.group<credentialsForm>({
                email: new FormControl(null, [
                    Validators.required,
                    Validators.email,
                ]),
                username: new FormControl(null, [Validators.required]),
                password: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/),
                ]),
                confirmPassword: new FormControl(null, {
                    validators: [
                        Validators.required,
                        this.validateConfirmPassword.bind(this),
                    ],
                    updateOn: 'blur',
                }),
            }),
        });
    }

    public next(): void {
        if (this.steps[this.activeStep]?.nextCallback?.() !== false)
            this.activeStep++;
    }

    public getCities(): void {
        const countryControl = this.registrationForm
            .get('anagraphics')
            ?.get('country');
        if (countryControl?.valid && countryControl?.value) {
            this.locationsService
                .getCities(
                    this.registrationForm.get('anagraphics')?.get('country')
                        ?.value as string,
                )
                .subscribe((cities) => {
                    this.cities = cities;
                });
        }
    }

    public completeCountries(event: AutoCompleteCompleteEvent): void {
        if (event.query.length < 2) {
            if (this.filteredCountries.length > 2) this.filteredCountries = [];
            return;
        }
        this.filteredCountries =
            this.locationsService.countries?.filter((country) =>
                country.toLowerCase().includes(event.query.toLowerCase()),
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

    private validateCountry(
        control: AbstractControl<string>,
    ): ValidationErrors {
        if (
            !control.value ||
            this.locationsService.countries?.includes(control.value)
        ) {
            return {};
        }
        return { noMatchingCountry: true };
    }

    private validateCity(control: AbstractControl<string>): ValidationErrors {
        const countryControl = this.registrationForm
            ?.get('anagraphics')
            ?.get('country');
        if (!countryControl?.valid && control.value)
            return { noCountrySelected: true };
        if (countryControl?.valid && countryControl?.value) {
            if (this.cities.includes(control.value)) {
                return {};
            }
            return { noMatchingCity: true };
        }
        if (!countryControl?.value) {
            if (!control.value) return {};
            return { noCountrySelected: true };
        }
        return { noMatchingCity: true };
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
}
