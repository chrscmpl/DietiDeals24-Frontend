import {
    Component,
    OnInit,
    Input,
    Self,
    EventEmitter,
    Output,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'dd24-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    standalone: true,
    imports: [],
})
export class InputComponent implements OnInit, ControlValueAccessor {
    @Input() disabled: boolean = false;
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: 'text' | 'email' | 'password' = 'text';
    @Input() requiredError: string = 'This field is required';
    @Input() error: string = 'Invalid input';
    @Output() focus: EventEmitter<any> = new EventEmitter();

    value: any = '';
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

    ngOnInit() {}

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

    onChangeWrapper(t: EventTarget | null) {
        if (!t) return;
        this.onChange((t as HTMLInputElement).value);
    }

    handleFocus(event: any) {
        this.focus.emit(event);
    }
}
