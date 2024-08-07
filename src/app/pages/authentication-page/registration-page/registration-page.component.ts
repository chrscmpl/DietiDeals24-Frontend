import { Component, OnInit } from '@angular/core';
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
import { GeographicalLocationsService } from '../../../services/locations.service';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserRegistrationDTO } from '../../../DTOs/user.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Country } from '../../../models/location.model';
import { environment } from '../../../../environments/environment';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';
import { MessageService } from 'primeng/api';
import { AssetsService } from '../../../services/assets.service';
import { take } from 'rxjs';

interface userDataForm {
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
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent implements OnInit {
    public registrationForm!: FormGroup<registrationForm>;
    public activeStep: number = 0;
    public error: string = '';

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
            nextCallback: this.onNextuserData,
        },
        {
            title: 'Your credentials',
            nextCallback: this.onNextCredentials,
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
    ) {}

    public ngOnInit(): void {
        this.maxBirthdayDate.setFullYear(
            this.maxBirthdayDate.getFullYear() - 18,
        );

        this.locationsService.refreshCountries();

        this.assets
            .getPlainText('tos.txt')
            .pipe(take(1))
            .subscribe((tos) => {
                this.tos = tos;
            });

        this.registrationForm = this.formBuilder.group<registrationForm>({
            userData: this.formBuilder.group<userDataForm>({
                name: new FormControl(null, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                surname: new FormControl(null, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                birthday: new FormControl(null, {
                    validators: [
                        Validators.required,
                        this.validateBirthday.bind(this),
                    ],
                    updateOn: 'submit',
                }),
                country: new FormControl(null, {
                    updateOn: 'blur',
                }),
                city: new FormControl(null, {
                    validators: this.validateCity.bind(this),
                    updateOn: 'blur',
                }),
            }),
            credentials: this.formBuilder.group<credentialsForm>({
                email: new FormControl(null, {
                    validators: [Validators.required, Validators.email],
                    updateOn: 'blur',
                }),
                username: new FormControl(null, {
                    validators: [Validators.required],
                    updateOn: 'blur',
                }),
                password: new FormControl(null, {
                    validators: [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(environment.passwordPattern),
                    ],
                    updateOn: 'blur',
                }),
                confirmPassword: new FormControl(null, {
                    validators: [
                        Validators.required,
                        this.validateConfirmPassword.bind(this),
                    ],
                    updateOn: 'blur',
                }),
            }),
            privacyPolicy: this.formBuilder.group<privacyPolicyForm>({
                accept: new FormControl(false, {
                    nonNullable: true,
                    validators: Validators.requiredTrue,
                }),
            }),
        });
    }

    public next(): void {
        if (this.steps[this.activeStep]?.nextCallback?.() !== false)
            this.activeStep++;
    }

    public onSubmit(): void {
        if (this.activeStep !== 2) {
            this.next();
            return;
        }

        this.onRegister();
    }

    private onRegister(): void {
        if (!this.registrationForm.valid) {
            this.onInvalidForm();
            return;
        }

        this.submissionLoading = true;

        this.error = '';

        const newUser = {
            ...this.registrationForm.value.userData,
            ...this.registrationForm.value.credentials,
        };

        delete newUser.confirmPassword;

        this.authentication.register(newUser as UserRegistrationDTO, {
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

    private onRegisterError(error: HttpErrorResponse): void {
        this.submissionLoading = false;
        if (error.status >= 500) {
            this.showErrorToast('Server error', 'Please try again later.');
        } else if (error.status === 409) {
            this.showErrorToast(
                'Conflict',
                'Email or username already in use.',
            );
        } else if (error.status >= 400) {
            this.showErrorToast(
                'Invalid data',
                'Please check your data and try again.',
            );
        } else {
            this.showErrorToast('Error', 'An error has occurred.');
        }
        console.error(error);
    }

    public onKeyPressed(event: KeyboardEvent): void {
        if (event.key === 'Enter') this.onSubmit();
    }

    public getCities(): void {
        const countryControl = this.registrationForm
            .get('userData')
            ?.get('country');
        if (countryControl?.valid && countryControl?.value) {
            this.locationsService
                .getCities(
                    this.registrationForm.get('userData')?.get('country')
                        ?.value as string,
                )
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

    public clearCity(): void {
        this.registrationForm.get('userData')?.get('city')?.setValue(null);
    }

    public setDialogVisibility(e: Event): void {
        if (
            e instanceof MouseEvent ||
            (e instanceof KeyboardEvent && e.key === 'Enter')
        )
            this.privacyPolicyDialogVisible = true;
    }

    private validateCity(control: AbstractControl<string>): ValidationErrors {
        const countryControl = this.registrationForm
            ?.get('userData')
            ?.get('country');
        if (!countryControl?.value) {
            if (!control.value) return {};
            return { noCountrySelected: true };
        } else if (!control.value) return { required: true };
        return {};
    }

    private validateBirthday(
        control: AbstractControl<string>,
    ): ValidationErrors {
        if (!control.value) return {};
        const birthday = new Date(control.value);

        if (isNaN(birthday.getTime())) return { pattern: true };
        if (birthday < this.minBirthdayDate) return { min: true };
        if (birthday > this.maxBirthdayDate) return { max: true };

        return {};
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
