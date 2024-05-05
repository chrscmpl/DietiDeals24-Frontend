import { Component, EventEmitter, Input, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'dd24-search-bar',
    standalone: true,
    imports: [],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements ControlValueAccessor {
    @Input() variant: 'default' | 'alternate' = 'default';
    @Input() disabled: boolean = false;
    @Input() placeholder: string = '';
    @Output() focusEvent: EventEmitter<any> = new EventEmitter();

    public onChange(_: any) {}
    public onTouched() {}

    value: any = '';

    constructor(@Self() public ngControl: NgControl) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
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
}
