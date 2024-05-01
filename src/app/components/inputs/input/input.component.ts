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
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

type validation =
    | 'required'
    | 'email'
    | 'min'
    | 'max'
    | 'pattern'
    | 'minlength'
    | 'maxlength'
    | 'all';

interface errorMessage {
    validation: validation | validation[];
    message: string;
}

@Component({
    selector: 'dd24-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    standalone: true,
    imports: [],
})
export class InputComponent
    implements OnInit, AfterViewInit, ControlValueAccessor
{
    @Input() disabled: boolean = false;
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: 'text' | 'email' | 'password' = 'text';
    @Input() errorMessages: errorMessage[] = [];
    @Input() set formError(err: boolean) {
        if (err && this.ngControl.control?.invalid) {
            this.errorMessage = this.getErrorMessage();
            this.shouldDisplayError = true;
            this.aggressiveValidation = true;
        }
    }
    @Output() focus: EventEmitter<any> = new EventEmitter();
    @ViewChild('inputElement', { static: false })
    inputElement!: ElementRef<HTMLInputElement>;

    value: any = '';
    isPassword: boolean = false;
    isPasswordVisible: boolean = false;
    static defaultError = 'Invalid input';
    errorMessage: string = '';
    shouldDisplayError: boolean = false;
    aggressiveValidation: boolean = false;

    public onChange(e: any) {}
    public onTouched() {}

    constructor(
        @Self()
        public ngControl: NgControl
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit() {
        this.isPassword = this.type === 'password';
        this.ngControl.control?.statusChanges.subscribe(() => {
            if (this.ngControl.control?.invalid) {
                this.errorMessage = this.getErrorMessage();
            }
            this.shouldDisplayError =
                (this.ngControl.control?.invalid &&
                    this.aggressiveValidation) ??
                false;
        });
    }

    ngAfterViewInit() {
        this.inputElement.nativeElement.addEventListener('blur', () => {
            this.shouldDisplayError =
                (this.ngControl.control?.invalid &&
                    this.ngControl.control?.touched) ??
                false;
            this.aggressiveValidation = this.shouldDisplayError;
            if (this.shouldDisplayError) {
                this.errorMessage = this.getErrorMessage();
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
        this.focus.emit(event);
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.type = this.isPasswordVisible ? 'text' : 'password';
    }

    private getErrorMessage(): string {
        const errors = this.ngControl.control?.errors;
        if (!errors) return '';
        const errorKeys = Object.keys(errors);
        const error = this.errorMessages.find((e) => {
            if (e.validation === 'all') return true;
            if (Array.isArray(e.validation)) {
                return e.validation.some((v) => errorKeys.includes(v));
            }
            return errorKeys.includes(e.validation);
        });
        return error?.message || InputComponent.defaultError;
    }
}
