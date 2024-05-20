import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

@Component({
    selector: 'dd24-registration-page',
    standalone: true,
    imports: [StepperModule, ButtonModule],
    templateUrl: './registration-page.component.html',
    styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent {
    public activeStep: number = 0;

    public nextStep(): void {
        if (this.activeStep < 2) this.activeStep++;
    }

    public prevStep(): void {
        if (this.activeStep > 0) this.activeStep--;
    }
}
