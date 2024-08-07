/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Component,
    OnInit,
    Input,
    NO_ERRORS_SCHEMA,
    OnDestroy,
    ElementRef,
    Renderer2,
} from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import {
    inputErrorMessagesManager,
    errorMessage,
} from '../../helpers/input-error-messages-manager';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'dd24-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    standalone: true,
    imports: [AsyncPipe],
    schemas: [NO_ERRORS_SCHEMA],
})
export class InputComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    @Input() errorMessages: errorMessage[] = [];
    @Input({ required: true }) controlName!: string;
    @Input() floatingError: boolean = false;

    private control?: AbstractControl | null;
    public error: string = '';
    private errorsManager?: inputErrorMessagesManager;
    private deleteKeypressListener: () => void = () => {};
    private inputElement: HTMLInputElement | null = null;

    constructor(
        private readonly controlContainer: ControlContainer,
        private readonly element: ElementRef,
        private readonly renderer: Renderer2,
    ) {}

    public ngOnInit() {
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

        this.checkError();
        this.listenForChanges();
        this.listenForDirty();
        if (this.isUpdateOn('blur')) {
            this.listenForEnter();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe);
        if (!this.control) return;
        if ((this.control as any)._markAsDirty)
            this.control.markAsDirty = (this.control as any)._markAsDirty;
        this.deleteKeypressListener();
    }

    private listenForChanges(): void {
        if (this.control)
            this.subscriptions.push(
                this.control.statusChanges.subscribe(() => this.checkError()),
            );
    }

    private listenForDirty(): void {
        if (!this.control) return;
        (this.control as any)._markAsDirty = this.control.markAsDirty;
        this.control.markAsDirty = (options) => {
            (this.control as any)._markAsDirty(options);
            this.checkError();
        };
    }

    private listenForEnter() {
        this.inputElement = this.element.nativeElement.querySelector('input');
        if (this.inputElement) {
            this.deleteKeypressListener = this.renderer.listen(
                this.inputElement,
                'keypress',
                (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        this.inputElement?.blur();
                    }
                },
            );
        }
    }

    private checkError(): void {
        if (this.control?.invalid && this.control?.dirty) {
            this.error = this.errorsManager?.getErrorMessage() || '';
        } else {
            this.error = '';
        }
    }

    private isUpdateOn(value: 'change' | 'blur' | 'submit'): boolean {
        return (
            (this.control as any)._updateOn === undefined ||
            (this.control as any)._updateOn === value
        );
    }
}
