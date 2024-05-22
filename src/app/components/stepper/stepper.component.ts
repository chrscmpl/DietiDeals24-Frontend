import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

export interface Step {
    title: string;
    nextCallback?: () => boolean;
    prevCallback?: () => boolean;
}

@Component({
    selector: 'dd24-stepper',
    standalone: true,
    imports: [StepperModule, ButtonModule],
    templateUrl: './stepper.component.html',
    styleUrl: './stepper.component.scss',
})
export class StepperComponent {
    @Input({ required: true }) steps!: Step[];

    private _activeIndex = 0;

    @Output() activeStepChange: EventEmitter<number> =
        new EventEmitter<number>();
    @Input() set activeStep(value: number) {
        if (value >= 0 && value < this.steps.length) this._activeIndex = value;
    }

    public set activeIndex(value: number) {
        this._activeIndex = value;
        this.activeStepChange.emit(value);
    }

    public get activeIndex(): number {
        return this._activeIndex;
    }

    public prevStep(): void {
        if (
            this.activeIndex > 0 &&
            this.steps[this.activeIndex].prevCallback?.() !== false
        ) {
            this.activeIndex--;
        }
    }

    public nextStep(): void {
        if (
            this.activeIndex < this.steps.length - 1 &&
            this.steps[this.activeIndex].nextCallback?.() !== false
        ) {
            this.activeIndex++;
        }
    }
}
