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
import { Observable, map } from 'rxjs';

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
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent implements OnInit {
    public registrationForm!: FormGroup<registrationForm>;
    public activeStep: number = 0;

    private countries: string[] = [];
    public filteredCountries: string[] = [];

    private cities: string[] = [];
    public filteredCities: string[] = [];

    public steps: Step[] = [
        {
            title: 'Your data',
        },
        {
            title: 'Your credentials',
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
        this.locationsService.countries$.subscribe((countries) => {
            this.countries = countries;
        });
        this.registrationForm = this.formBuilder.group<registrationForm>({
            anagraphics: this.formBuilder.group<anagraphicsForm>({
                name: new FormControl(null, [Validators.required]),
                surname: new FormControl(null, [Validators.required]),
                birthday: new FormControl(null, [Validators.required]),
                country: new FormControl(null, {
                    validators: this.validateCountry,
                    updateOn: 'blur',
                }),
                city: new FormControl(null, []),
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
                confirmPassword: new FormControl(null, [Validators.required]),
            }),
        });
    }

    public next(): void {
        if (this.steps[this.activeStep]?.nextCallback?.() !== false)
            this.activeStep++;
    }

    public completeCountries(event: AutoCompleteCompleteEvent): void {
        if (event.query.length < 2) {
            if (this.filteredCountries.length > 2) this.filteredCountries = [];
            return;
        }
        this.filteredCountries = this.countries.filter((country) =>
            country.toLowerCase().includes(event.query.toLowerCase()),
        );
    }

    private validateCountry(
        control: AbstractControl<string>,
    ): ValidationErrors {
        if (!control.value || this.countries.includes(control.value)) {
            return {};
        }
        return { noMatchingCountry: true };
    }
}
