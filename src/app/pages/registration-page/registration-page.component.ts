import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
    Step,
    StepperComponent,
} from '../../components/stepper/stepper.component';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputComponent } from '../../components/input/input.component';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';

interface anagraphicsForm {
    name: FormControl<string | null>;
    surname: FormControl<string | null>;
    birthday: FormControl<string | null>;
    Country: FormControl<string | null>;
    City: FormControl<string | null>;
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
    ],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent implements OnInit {
    public registrationForm!: FormGroup<registrationForm>;
    public activeStep: number = 0;

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

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.registrationForm = this.formBuilder.group<registrationForm>({
            anagraphics: this.formBuilder.group<anagraphicsForm>({
                name: new FormControl(null, [Validators.required]),
                surname: new FormControl(null, [Validators.required]),
                birthday: new FormControl(null, [Validators.required]),
                Country: new FormControl(null, [Validators.required]),
                City: new FormControl(null, [Validators.required]),
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
}
