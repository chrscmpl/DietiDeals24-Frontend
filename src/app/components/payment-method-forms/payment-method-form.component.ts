import { Component, Input, OnInit } from '@angular/core';
import { PaymentMethodType } from '../../enums/payment-method-type';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputComponent } from '../input/input.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { isValid as isValidIBAN } from 'iban-ts';
import { WarningsService } from '../../services/warnings.service';
import { ToReactiveForm } from '../../typeUtils/ToForm';
import {
    IBANRegistrationDTO,
    UnauthorizedCreditCardRegistrationDTO,
} from '../../DTOs/payment-method.dto';

type IBANForm = ToReactiveForm<IBANRegistrationDTO>;

type CreditCardForm = ToReactiveForm<UnauthorizedCreditCardRegistrationDTO>;

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

    public constructor(
        private readonly formBuilder: FormBuilder,
        private readonly warning: WarningsService,
    ) {}

    public ngOnInit(): void {
        if (this.type === this.form.get('newMethod')?.value?.type) {
            return;
        }

        this.form.get('save')?.patchValue(false);

        if (this.type === PaymentMethodType.IBAN) {
            this.form.setControl(
                'newMethod',
                this.formBuilder.group<IBANForm>({
                    type: new FormControl<PaymentMethodType.IBAN | null>(
                        PaymentMethodType.IBAN,
                    ),
                    iban: new FormControl<string | null>(null, {
                        updateOn: 'blur',
                        validators: [
                            Validators.required,
                            this.validateIBAN.bind(this),
                        ],
                    }),
                }),
            );
            this.warning.showIBANexample();
        } else if (this.type === PaymentMethodType.creditCard) {
            this.form.setControl(
                'newMethod',
                this.formBuilder.group<CreditCardForm>({
                    type: new FormControl<PaymentMethodType.creditCard | null>(
                        PaymentMethodType.creditCard,
                    ),
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

    private validateIBAN(
        ibanControl: FormControl<string | null>,
    ): ValidationErrors | null {
        if (!ibanControl.value) return null;
        return isValidIBAN(ibanControl.value) ? null : { invalidIBAN: true };
    }
}
