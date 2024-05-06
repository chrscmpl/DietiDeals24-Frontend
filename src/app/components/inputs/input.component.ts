/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Component,
    OnInit,
    Input,
    Self,
    EventEmitter,
    Output,
    OnDestroy,
    NO_ERRORS_SCHEMA,
    ContentChild,
    AfterContentInit,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
    ErrorMessagesManager,
    errorMessage,
} from '../../helpers/inputErrorMessagesManager';
import { Observable, Subscription } from 'rxjs';
import { TextInputComponent } from './text-input/text-input.component';

export interface dd24Input {
    name: string;
    placeholder: string;
    value: string;
    disabled: boolean;

    focusEvent: EventEmitter<void>;
    blurEvent: EventEmitter<void>;
    inputEvent: EventEmitter<string>;
}

@Component({
    selector: 'dd24-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    standalone: true,
    imports: [TextInputComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class InputComponent
    implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit
{
    @Input({ required: true }) name!: string;
    @Input() disabled: boolean = false;
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: 'text' | 'email' | 'password' = 'text';
    @Input() errorMessages: errorMessage[] = [];
    @Input() formError$?: Observable<boolean>;

    @Output() focusEvent: EventEmitter<any> = new EventEmitter();

    public value: any = '';
    public errorMessage: string = '';
    public aggressiveValidation: boolean = false;
    private _shouldDisplayError: boolean = false;

    public get shouldDisplayError(): boolean {
        return this._shouldDisplayError;
    }

    public set shouldDisplayError(value: boolean) {
        this.setErrorState(value);
        this._shouldDisplayError = value;
    }

    private formErrorSubscription?: Subscription;

    @ContentChild(TextInputComponent) textInputComponent?: TextInputComponent;

    private inputChild!: dd24Input;

    constructor(
        @Self()
        public ngControl: NgControl,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit() {
        this.ngControl.control?.statusChanges.subscribe(() => {
            if (this.ngControl.control?.invalid) {
                this.errorMessage = ErrorMessagesManager.getErrorMessage(
                    this.ngControl,
                    this.errorMessages,
                );
            }
            this.shouldDisplayError =
                (this.ngControl.control?.invalid &&
                    this.aggressiveValidation) ??
                false;
        });
        this.formErrorSubscription = this.formError$?.subscribe(
            (err: boolean) => {
                if (err && this.ngControl.control?.invalid) {
                    this.errorMessage = ErrorMessagesManager.getErrorMessage(
                        this.ngControl,
                        this.errorMessages,
                    );
                    this.shouldDisplayError = true;
                    this.aggressiveValidation = true;
                }
            },
        );
    }

    ngAfterContentInit(): void {
        const input: dd24Input | undefined = [this.textInputComponent].find(
            (component) => component !== undefined,
        );
        if (!input) {
            throw new Error('No input component found');
        }
        this.inputChild = input;
        this.inputChild.name = this.name;
        this.inputChild.disabled = this.disabled;
        this.inputChild.placeholder = this.placeholder;
        this.inputChild.value = this.value;
        this.inputChild.focusEvent.subscribe((event: any) => {
            this.handleFocus(event);
        });
        this.inputChild.blurEvent.subscribe(() => {
            this.handleBlur();
        });
        this.inputChild.inputEvent.subscribe((value: string) => {
            this.value = value;
            this.onChange(value);
        });
        if (this.textInputComponent) {
            this.textInputComponent.type = this.type;
        }
    }

    ngOnDestroy(): void {
        this.formErrorSubscription?.unsubscribe();
    }

    private setErrorState(value: boolean): void {
        if (this.textInputComponent) {
            this.textInputComponent.error = value;
        }
    }

    public onChange(_: any) {}
    public onTouched() {}

    public writeValue(value: any): void {
        this.value = value;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public handleBlur() {
        this.onTouched();
        this.shouldDisplayError =
            (this.ngControl.control?.invalid &&
                this.ngControl.control?.touched) ??
            false;
        this.aggressiveValidation = this.shouldDisplayError;
        if (this.shouldDisplayError) {
            this.errorMessage = ErrorMessagesManager.getErrorMessage(
                this.ngControl,
                this.errorMessages,
            );
        }
    }

    public handleFocus(event: any): void {
        this.focusEvent.emit(event);
    }
}
