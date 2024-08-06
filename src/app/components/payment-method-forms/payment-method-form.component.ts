import { Component, Input, OnInit } from '@angular/core';
import { PaymentMethodType } from '../../enums/payment-method-type';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputComponent } from '../input/input.component';
import { InputNumberModule } from 'primeng/inputnumber';

interface IBANForm {
    iban: FormControl<string | null>;
}

interface CreditCardForm {
    cardNumber: FormControl<string | null>;
    ownerName: FormControl<string | null>;
    expirationDate: FormControl<string | null>;
    cvv: FormControl<string | null>;
}

export interface NewPaymentMethodForm {
    newMethod?: FormGroup<IBANForm> | FormGroup<CreditCardForm>;
    save: FormControl<boolean | null>;
}

@Component({
    selector: 'dd24-payment-method-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        CheckboxModule,
        InputComponent,
    ],
    templateUrl: './payment-method-form.component.html',
    styleUrl: './payment-method-form.component.scss',
})
export class PaymentMethodFormComponent implements OnInit {
    private _type!: PaymentMethodType;

    @Input({ required: true }) public set type(value: PaymentMethodType) {
        if (!this._type) this._type = value;
    }
    @Input({ required: true }) public form!: FormGroup<NewPaymentMethodForm>;
    @Input() public formStyle: { [key: string]: string | number | boolean } =
        {};

    public get type(): PaymentMethodType {
        return this._type;
    }

    public readonly PaymentMethodType = PaymentMethodType;

    public constructor(private readonly formBuilder: FormBuilder) {}

    public ngOnInit(): void {
        if (this.form.get('save')) this.form.get('save')?.patchValue(false);
        else {
            this.form.setControl(
                'save',
                new FormControl<boolean | null>(false),
            );
        }

        if (this.type === PaymentMethodType.IBAN) {
            this.form.setControl(
                'newMethod',
                this.formBuilder.group<IBANForm>({
                    iban: new FormControl<string | null>(null, [
                        Validators.required,
                    ]),
                }),
            );
        } else if (this.type === PaymentMethodType.creditCard) {
            this.form.setControl(
                'newMethod',
                this.formBuilder.group<CreditCardForm>({
                    cardNumber: new FormControl<string | null>(null, [
                        Validators.required,
                    ]),
                    ownerName: new FormControl<string | null>(null, [
                        Validators.required,
                    ]),
                    expirationDate: new FormControl<string | null>(null, [
                        Validators.required,
                    ]),
                    cvv: new FormControl<string | null>(null, [
                        Validators.required,
                    ]),
                }),
            );
        }
    }

    public get newMethodGroup(): FormGroup {
        return this.form.get('newMethod') as FormGroup;
    }
}
