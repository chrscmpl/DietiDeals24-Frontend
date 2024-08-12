/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    // ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
    ToggleButtonChangeEvent,
    ToggleButtonModule,
} from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'dd24-radio-toggle-button',
    standalone: true,
    imports: [
        ToggleButtonModule,
        FormsModule,
        RadioButtonModule,
        // ReactiveFormsModule,
    ],
    templateUrl: './radio-toggle-button.component.html',
    styleUrl: './radio-toggle-button.component.scss',
})
export class RadioToggleButtonComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    @Input({ required: true }) public value!: any;
    @Input({ required: true }) public form!: FormGroup;
    @Input({ required: true }) public controlName!: string;
    @Input() public label: string = '';
    @Input() public checkedLabel: string = '';
    @Input() public uncheckedLabel: string = '';

    public control!: FormControl;
    public checked: boolean = false;

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
        this.control = this.form.get(this.controlName) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }

    private checkChecked(value: any): void {
        const checked = value === this.value;
        if (checked !== this.checked) this.checked = checked;
    }

    public onChange(e: ToggleButtonChangeEvent): void {
        if (e.checked) this.control.setValue(this.value);
    }

    public stopPropagation(e: Event): void {
        e.stopPropagation();
    }
}
