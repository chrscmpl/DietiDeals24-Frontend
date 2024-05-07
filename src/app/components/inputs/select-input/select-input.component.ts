import { Component, EventEmitter, Input, Output } from '@angular/core';
import { dd24Input } from '../input.component';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'dd24-select-input',
    standalone: true,
    imports: [],
    templateUrl: './select-input.component.html',
    styleUrl: './select-input.component.scss',
})
export class SelectInputComponent implements dd24Input {
    @Input() name: string = '';
    @Input() disabled: boolean = false;
    @Input() value: string = '';
    @Input() placeholder: string = '';
    @Input() error$: Observable<boolean> = of(false);
    @Input() set error(err: boolean) {
        this.error$ = of(err);
    }
    @Input() options: string[] = [];

    @Output() focusEvent: EventEmitter<void> = new EventEmitter();
    @Output() blurEvent: EventEmitter<void> = new EventEmitter();
    @Output() inputEvent: EventEmitter<string> = new EventEmitter();

    isPassword: boolean = false;
    isPasswordVisible: boolean = false;

    emitFocus(): void {
        this.focusEvent.emit();
    }

    emitBlur(): void {
        this.blurEvent.emit();
    }

    emitInput(event: Event): void {
        if (event.target) {
            this.inputEvent.emit((event.target as HTMLInputElement).value);
        }
    }
}
