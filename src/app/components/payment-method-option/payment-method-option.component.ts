import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PaymentMethod } from '../../models/payment-method.model';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaskedPipe } from '../../pipes/masked.pipe';

@Component({
    selector: 'dd24-payment-method-option',
    standalone: true,
    imports: [RadioButtonModule, ReactiveFormsModule, MaskedPipe],
    templateUrl: './payment-method-option.component.html',
    styleUrl: './payment-method-option.component.scss',
})
export class PaymentMethodOptionComponent implements OnInit {
    @ViewChild('radioButton') public radioButton!: RadioButton;

    @Input({ required: true }) public controlName!: string;
    @Input({ required: true }) public form!: FormGroup;
    @Input({ required: true }) public value!: PaymentMethod;

    public optionValue!: { id: string };

    @Input() public optionStyle: { [key: string]: string | number | boolean } =
        {};

    public showNumber: boolean = false;

    constructor() {}

    public ngOnInit(): void {
        this.optionValue = { id: this.value.id };
    }

    public toggleNumberVisibility(e: Event): void {
        e.stopPropagation();
        this.showNumber = !this.showNumber;
    }

    public onSelect() {
        this.form.controls[this.controlName].setValue(this.optionValue);
    }
}
