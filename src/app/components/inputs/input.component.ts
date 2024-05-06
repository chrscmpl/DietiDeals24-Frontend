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
} from '../../helpers/inputErrorMessages';
import { Observable, Subscription } from 'rxjs';
import { TextInputComponent } from './text-input/text-input.component';

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

    public TextInputComponent = TextInputComponent;

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
        if (this.textInputComponent) {
            this.textInputComponent.disabled = this.disabled;
            this.textInputComponent.value = this.value;
            this.textInputComponent.placeholder = this.placeholder;
            this.textInputComponent.type = this.type;
            this.textInputComponent.name = this.name;
            this.textInputComponent.focusEvent.subscribe((event: any) => {
                this.handleFocus(event);
            });
            this.textInputComponent.blurEvent.subscribe(() => {
                this.handleBlur();
            });
            this.textInputComponent.inputEvent.subscribe((value: string) => {
                this.value = value;
                this.onChange(value);
            });
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
