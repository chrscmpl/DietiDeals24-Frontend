import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { InputComponent } from '../input/input.component';
import { errorMessage } from '../../helpers/input-error-messages-manager';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'dd24-editable-field',
    standalone: true,
    imports: [
        InputComponent,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
    templateUrl: './editable-field.component.html',
    styleUrl: './editable-field.component.scss',
})
export class EditableFieldComponent implements OnInit {
    @Input() errorMessages: errorMessage[] = [];
    @Input({ required: true }) controlName!: string;
    @Input() floatingError: boolean = false;
    @Input() currentValue: string | null = null;

    @Output() public enabled: EventEmitter<void> = new EventEmitter<void>();
    @Output() public submission: EventEmitter<void> = new EventEmitter<void>();

    public control!: AbstractControl;

    public constructor(
        private readonly controlContainer: ControlContainer,
        private readonly element: ElementRef,
    ) {}

    public ngOnInit(): void {
        this.control = this.controlContainer.control?.get(
            this.controlName,
        ) as AbstractControl;
        if (!this.control) throw new Error('No FormControl provided');
    }

    public enable() {
        this.control.enable();
        this.element.nativeElement.querySelector('input')?.focus();
    }

    public disable() {
        if (this.currentValue !== null) {
            this.control.setValue(this.currentValue);
        }
        this.control.disable();
    }

    public emitSubmit() {
        this.submission.emit();
    }
}
