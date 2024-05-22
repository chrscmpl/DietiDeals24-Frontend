import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

@Component({
    selector: 'dd24-stepper',
    standalone: true,
    imports: [StepperModule, ButtonModule],
    templateUrl: './stepper.component.html',
    styleUrl: './stepper.component.scss',
})
export class StepperComponent {
    @Input({ required: true }) steps!: {
        title: string;
        nextCallback?: () => boolean;
        prevCallback?: () => boolean;
    }[];

    activeStep = 0;

    public prevStep(): void {
        if (
            this.activeStep > 0 &&
            this.steps[this.activeStep].prevCallback?.() !== false
        ) {
            this.activeStep--;
        }
    }

    public nextStep(): void {
        if (
            this.activeStep < this.steps.length - 1 &&
            this.steps[this.activeStep].nextCallback?.() !== false
        ) {
            this.activeStep++;
        }
    }
}
