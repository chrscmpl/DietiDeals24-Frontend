import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { take } from 'rxjs';
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

interface CompleteUserDataForm {
    name: FormControl<string | null>;
    surname: FormControl<string | null>;
    birthday: FormControl<Date | null>;
    country: FormControl<string | null>;
    city: FormControl<string | null>;
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
    ],
    templateUrl: './social-registration-page.component.html',
    styleUrl: './social-registration-page.component.scss',
})
export class SocialRegistrationPageComponent implements OnInit {
    public user!: SocialUser;
    public submissionLoading: boolean = false;
    public completeUserDataForm!: FormGroup<CompleteUserDataForm>;

    public readonly environment = environment;

    private countries: Country[] = [];
    public filteredCountries: Country[] = [];

    private cities: string[] = [];
    public filteredCities: string[] = [];

    public minBirthdayDate: Date = new Date(1900, 0, 1);
    public maxBirthdayDate: Date = new Date();
    public defaultBirthdayDate: Date = new Date(2000, 0, 1);

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly http: HttpClient,
        private readonly formBuilder: FormBuilder,
        private readonly locationsService: GeographicalLocationsService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.user = data['user'];
            this.initForm();
            this.http
                .post('oauth/google/debug', { oauthToken: this.user.idToken })
                .subscribe();
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
    }

    public onSubmit(): void {
        if (!this.completeUserDataForm.valid) {
            reactiveFormsUtils.markAllAsDirty(this.completeUserDataForm);
            return;
        }

        this.submissionLoading = true;
    }

    private initForm(): void {
        this.completeUserDataForm =
            this.formBuilder.group<CompleteUserDataForm>({
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
            });
        this.completeUserDataForm.controls.city.disable();
    }

    private handleCityControl(): void {
        this.completeUserDataForm.controls.country.valueChanges.subscribe(
            (v) => {
                const cityControl = this.completeUserDataForm.controls.city;

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
        const countryControl = this.completeUserDataForm.controls.country;
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
