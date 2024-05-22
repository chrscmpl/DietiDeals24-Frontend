import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperComponent } from '../../components/stepper/stepper.component';

@Component({
    selector: 'dd24-registration-page',
    standalone: true,
    imports: [StepperComponent, ButtonModule],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent {
    public activeStep: number = 0;

    public steps = [
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
}
