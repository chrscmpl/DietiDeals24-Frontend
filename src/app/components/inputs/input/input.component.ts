/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Component,
    OnInit,
    Input,
    Self,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
    ErrorMessagesManager,
    errorMessage,
} from '../../../helpers/inputErrorMessages';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'dd24-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    standalone: true,
    imports: [],
})
export class InputComponent
    implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor
{
    @Input({ required: true }) name!: string;
    @Input() disabled: boolean = false;
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: 'text' | 'email' | 'password' = 'text';
    @Input() errorMessages: errorMessage[] = [];
    @Input() formError$?: Observable<boolean>;
    private formErrorSubscription?: Subscription;

    @Output() focusEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild('inputElement', { static: false })
    inputElement!: ElementRef<HTMLInputElement>;

    value: any = '';
    isPassword: boolean = false;
    isPasswordVisible: boolean = false;
    errorMessage: string = '';
    shouldDisplayError: boolean = false;
    aggressiveValidation: boolean = false;

    public onChange(_: any) {}
    public onTouched() {}

    constructor(
        @Self()
        public ngControl: NgControl,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit() {
        this.isPassword = this.type === 'password';
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

    ngOnDestroy(): void {
        this.formErrorSubscription?.unsubscribe();
    }

    ngAfterViewInit() {
        this.inputElement.nativeElement.addEventListener('blur', () => {
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
        });
    }

    writeValue(value: any): void {
        this.value = value;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onChangeWrapper(t: EventTarget | null): void {
        if (!t) return;
        this.onChange((t as HTMLInputElement).value);
    }

    handleFocus(event: any): void {
        this.focusEvent.emit(event);
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.type = this.isPasswordVisible ? 'text' : 'password';
    }
}
