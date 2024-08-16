/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { ControlContainer, FormControl, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
    ToggleButtonChangeEvent,
    ToggleButtonModule,
} from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'dd24-radio-toggle-button',
    standalone: true,
    imports: [ToggleButtonModule, FormsModule, RadioButtonModule],
    templateUrl: './radio-toggle-button.component.html',
    styleUrl: './radio-toggle-button.component.scss',
})
export class RadioToggleButtonComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    @Input({ required: true }) public value!: any;
    @Input({ required: true }) public controlName!: string;
    @Input() public label: string = '';
    @Input() public checkedLabel: string = '';
    @Input() public uncheckedLabel: string = '';

    public control!: FormControl;
    public isChecked: boolean = false;
    @Input() public buttonStyle: { [key: string]: string | number | boolean } =
        {};

    @Output() public checked = new EventEmitter<void>();

    public constructor(private readonly controlContainer: ControlContainer) {}

    public ngOnInit(): void {
        this.setControl();

        this.checkChecked(this.control.value);
        this.subscriptions.push(
            this.control.valueChanges.subscribe(this.checkChecked.bind(this)),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe(),
        );
    }

    private setControl(): void {
        this.control = this.controlContainer.control?.get(
            this.controlName,
        ) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }

    private checkChecked(value: any): void {
        const checked = value === this.value;
        if (checked !== this.isChecked) this.isChecked = checked;
    }

    public onChange(e: ToggleButtonChangeEvent): void {
        if (!e.checked) return;
        this.control.setValue(this.value);
        this.control.markAsDirty();
        this.control.markAsTouched();
        this.checked.emit();
    }

    public stopPropagation(e: Event): void {
        e.stopPropagation();
    }
}
