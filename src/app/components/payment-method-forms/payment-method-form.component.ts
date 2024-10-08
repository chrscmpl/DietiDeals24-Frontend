import { Component, Input, OnInit } from '@angular/core';
import { PaymentMethodType } from '../../enums/payment-method-type.enum';
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
import { ToReactiveForm } from '../../type-utils/to-reactive-form.type';
import { InputMaskModule } from 'primeng/inputmask';
import { DescendantsAttributesDirective } from '../../directives/descentant-attributes.directive';

type IBANForm = ToReactiveForm<{
    type: PaymentMethodType.IBAN;
    iban: string;
}>;

type CreditCardForm = ToReactiveForm<{
    type: PaymentMethodType.creditCard;
    ownerName: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}>;

export interface NewPaymentMethodForm {
    newMethod?: FormGroup<IBANForm> | FormGroup<CreditCardForm>;
    save?: FormControl<boolean | null>;
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
        InputMaskModule,
        DescendantsAttributesDirective,
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
        if (this.type === this.form.controls.newMethod?.value?.type) {
            return;
        }

        this.form.controls.save?.patchValue(false);

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
                    ownerName: new FormControl<string | null>(null, {
                        validators: [Validators.required],
                        updateOn: 'blur',
                    }),
                    cardNumber: new FormControl<string | null>(null, {
                        validators: [
                            Validators.required,
                            Validators.minLength(16),
                            Validators.maxLength(16),
                        ],
                        updateOn: 'blur',
                    }),
                    expirationDate: new FormControl<string | null>(null, {
                        validators: [
                            Validators.required,
                            this.validateCardExpirationDate.bind(this),
                        ],
                        updateOn: 'blur',
                    }),
                    cvv: new FormControl<string | null>(null, {
                        validators: [Validators.required],
                        updateOn: 'blur',
                    }),
                }),
            );
        }
    }

    public get newMethodGroup(): FormGroup {
        return this.form.controls.newMethod!;
    }

    public toggleSave(e: KeyboardEvent): void {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        e.stopPropagation();
        this.form.get('save')?.patchValue(!this.form.controls.save?.value);
    }

    private validateIBAN(
        ibanControl: FormControl<string | null>,
    ): ValidationErrors | null {
        if (!ibanControl.value) return null;
        return isValidIBAN(ibanControl.value) ? null : { invalidIBAN: true };
    }

    private validateCardExpirationDate(
        control: FormControl<string | null>,
    ): ValidationErrors | null {
        if (control.value?.length !== 5) return { invalidExpirationDate: true };
        const month = Number(control.value.slice(0, 2));
        const year = Number(control.value.slice(3, 5));
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (isNaN(month) || isNaN(year) || month < 1 || month > 12)
            return { invalidExpirationDate: true };
        if (
            year < currentYear ||
            (year === currentYear && month < currentMonth)
        )
            return { expirationDatePassed: true };
        return null;
    }
}
