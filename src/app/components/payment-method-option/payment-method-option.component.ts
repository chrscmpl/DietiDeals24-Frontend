import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PaymentMethod } from '../../models/payment-method.model';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaskedPipe } from '../../pipes/masked.pipe';
import { PaymentMethodType } from '../../enums/payment-method-type.enum';
import { PaymentMethodLabelPipe } from '../../pipes/payment-method-label.pipe';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-payment-method-option',
    standalone: true,
    imports: [
        RadioButtonModule,
        ReactiveFormsModule,
        MaskedPipe,
        PaymentMethodLabelPipe,
        AsyncPipe,
    ],
    templateUrl: './payment-method-option.component.html',
    styleUrl: './payment-method-option.component.scss',
})
export class PaymentMethodOptionComponent implements OnInit {
    @ViewChild('radioButton') public radioButton!: RadioButton;

    @Input({ required: true }) public controlName!: string;
    @Input({ required: true }) public form!: FormGroup;
    @Input({ required: true }) public value!: PaymentMethod | PaymentMethodType;
    @Input() public optionStyle: { [key: string]: string | number | boolean } =
        {};

    public optionValue!: { id: string } | PaymentMethodType;

    constructor(public readonly windowService: WindowService) {}

    public ngOnInit(): void {
        this.optionValue =
            this.value instanceof PaymentMethod
                ? { id: this.value.id }
                : this.value;
    }

    public onSelect() {
        this.form.controls[this.controlName].setValue(this.optionValue);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onSelect();
        }
    }

    public isSavedPaymentMethod(): boolean {
        return this.value instanceof PaymentMethod;
    }

    public get savedPaymentMethodValue(): PaymentMethod {
        return this.value as PaymentMethod;
    }

    public get paymentMethodTypeValue(): PaymentMethodType {
        return this.value as PaymentMethodType;
    }
}
