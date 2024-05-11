/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Component,
    OnInit,
    Input,
    NO_ERRORS_SCHEMA,
    OnDestroy,
    AfterViewInit,
} from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import {
    inputErrorMessagesManager,
    errorMessage,
} from '../../helpers/inputErrorMessagesManager';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    standalone: true,
    imports: [AsyncPipe],
    schemas: [NO_ERRORS_SCHEMA],
})
export class InputComponent implements OnInit {
    @Input() errorMessages: errorMessage[] = [];
    @Input({ required: true }) controlName!: string;

    private control?: AbstractControl | null;
    public error: string = '';
    private errorsManager?: inputErrorMessagesManager;

    constructor(private controlContainer: ControlContainer) {}

    ngOnInit() {
        this.control = this.controlContainer?.control?.get(this.controlName);

        if (!this.control) {
            throw new Error(
                `InputComponent: FormControl with name ${this.controlName} does not exist`,
            );
        }

        this.errorsManager = new inputErrorMessagesManager({
            control: this.control,
            errors: this.errorMessages,
        });

        this.listenForChanges();
        this.listenForTouched();
    }

    private listenForChanges(): void {
        this.control?.statusChanges.subscribe(() => this.onChanges());
    }

    private listenForTouched(): void {
        if (!this.control) return;
        (this.control as any)._markAsTouched = this.control.markAsTouched;
        this.control.markAsTouched = (options) => {
            (this.control as any)._markAsTouched(options);
            this.onTouched();
        };
    }

    private onChanges(): void {
        this.checkError();
    }

    private onTouched(): void {
        setTimeout(() => {
            this.checkError(true);
            if (this.control?.valid) {
                this.control.markAsUntouched();
            }
        }, 150);
    }

    private checkError(blurred: boolean = false): void {
        if (this.control?.invalid && (this.control?.touched || blurred)) {
            this.error = this.errorsManager?.getErrorMessage() || '';
        } else {
            this.error = '';
        }
    }
}
