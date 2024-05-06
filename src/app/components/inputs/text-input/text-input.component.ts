import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'dd24-text-input',
    standalone: true,
    imports: [],
    templateUrl: './text-input.component.html',
    styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements OnInit {
    @Input() name: string = '';
    @Input() disabled: boolean = false;
    @Input() value: string = '';
    @Input() placeholder: string = '';
    @Input() type: 'text' | 'email' | 'password' = 'text';
    @Input() error: boolean = false;

    @Output() focusEvent: EventEmitter<void> = new EventEmitter();
    @Output() blurEvent: EventEmitter<void> = new EventEmitter();
    @Output() inputEvent: EventEmitter<string> = new EventEmitter();

    isPassword: boolean = false;
    isPasswordVisible: boolean = false;

    ngOnInit(): void {
        this.isPassword = this.type === 'password';
    }

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

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.type = this.isPasswordVisible ? 'text' : 'password';
    }
}
