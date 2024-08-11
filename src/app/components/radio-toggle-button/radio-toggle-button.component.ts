/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
    ToggleButtonChangeEvent,
    ToggleButtonModule,
} from 'primeng/togglebutton';

@Component({
    selector: 'dd24-radio-toggle-button',
    standalone: true,
    imports: [ToggleButtonModule, FormsModule],
    templateUrl: './radio-toggle-button.component.html',
    styleUrl: './radio-toggle-button.component.scss',
})
export class RadioToggleButtonComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    @Input({ required: true }) public value!: any;
    @Input({ required: true }) public label!: string;
    @Input() public formControl?: FormControl;
    @Input() public formGroup?: FormGroup;
    @Input() public formControlName?: string;

    private control!: FormControl;
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
        if (this.formControl) this.control = this.formControl;
        else if (this.formGroup && this.formControlName)
            this.control = this.formGroup.get(
                this.formControlName,
            ) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }

    private checkChecked(value: any): void {
        const checked = value === this.value;
        if (checked !== this.checked) this.checked = checked;
    }

    public onChange(e: ToggleButtonChangeEvent): void {
        if (e.checked) this.control.setValue(this.value);
    }
}
