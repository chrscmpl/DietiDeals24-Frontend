/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Component,
    OnInit,
    Input,
    NO_ERRORS_SCHEMA,
    ElementRef,
    Renderer2,
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
export class InputComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() errorMessages: errorMessage[] = [];
    @Input({ required: true }) controlName!: string;

    private control?: AbstractControl | null;
    public error: string = '';
    private errorsManager?: inputErrorMessagesManager;
    private blurListener: () => void = () => {};

    constructor(
        private controlContainer: ControlContainer,
        private elementRef: ElementRef,
        private renderer: Renderer2,
    ) {}

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

        this.control.statusChanges.subscribe(() => this.checkError());
    }

    ngAfterViewInit() {
        const child = this.getNativeInputElement();
        if (child) {
            this.blurListener = this.renderer.listen(child, 'blur', () => {
                setTimeout(() => {
                    this.checkError(true);
                }, 100);
            });
        }
    }

    ngOnDestroy() {
        this.blurListener();
    }

    private getNativeInputElement(): HTMLInputElement | null {
        return this.elementRef.nativeElement.querySelector('input');
    }

    private checkError(blurred: boolean = false): void {
        if (this.control?.invalid && (this.control?.touched || blurred)) {
            this.error = this.errorsManager?.getErrorMessage() || '';
        } else {
            this.error = '';
        }
    }
}
