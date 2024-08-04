import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { take } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { WindowService } from '../../../services/window.service';
import { PaymentMethodOptionComponent } from '../../../components/payment-method-option/payment-method-option.component';
import { SavedChosenPaymentMethodDTO } from '../../../DTOs/payment-method.dto';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { PaymentMethod } from '../../../models/payment-method.model';
import { PaymentMethodCategory } from '../../../enums/payment-method-category.enum';
import { TransactionOperation } from '../../../enums/transaction-operation.enum';
import { PaymentMethodType } from '../../../enums/payment-method-type';
import { paymentMethodTypesPerCategory } from '../../../helpers/payment-method-types-per-category';
import { AuctionKindPipe } from '../../../pipes/auction-kind.pipe';
import { CheckoutInformation } from '../../../models/checkout-information.model';

interface PaymentMethodForm {
    chosenPaymentMethod: FormControl<
        SavedChosenPaymentMethodDTO | PaymentMethodType | null
    >;
}

@Component({
    selector: 'dd24-checkout-page',
    standalone: true,
    imports: [
        CurrencyPipe,
        AsyncPipe,
        PaymentMethodOptionComponent,
        ReactiveFormsModule,
        AuctionKindPipe,
    ],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
    public readonly OPERATIONS = TransactionOperation;
    public readonly PAYMENT_METHOD_CATEGORIES = PaymentMethodCategory;
    public bidAmount?: number;
    public auction?: Auction;
    public operation?: TransactionOperation;
    public requiredCategory?: PaymentMethodCategory;

    public paymentMethodForm!: FormGroup<PaymentMethodForm>;

    public savedPaymentMethodOptions: PaymentMethod[] = [];

    public newPaymentMethodOptions: PaymentMethodType[] = [];

    public newPaymentMethodFormVisible?: null | PaymentMethodType = null;

    constructor(
        private readonly route: ActivatedRoute,
        public readonly windowService: WindowService,
        private readonly formBuilder: FormBuilder,
    ) {}

    public ngOnInit(): void {
        this.initCheckoutOperation();

        this.initForm();
    }

    private initCheckoutOperation() {
        this.route.data.pipe(take(1)).subscribe((data) => {
            const checkoutInformation = data[
                'checkoutInformation'
            ] as CheckoutInformation;

            this.auction = checkoutInformation.auction;
            this.bidAmount = checkoutInformation.bidAmount;
            this.operation = checkoutInformation.operation;
            this.requiredCategory = checkoutInformation.requiredCategory;
            this.savedPaymentMethodOptions = checkoutInformation.methods;

            this.initPaymentOptions();
        });
    }

    private initForm() {
        this.paymentMethodForm = this.formBuilder.group({
            chosenPaymentMethod: new FormControl<
                SavedChosenPaymentMethodDTO | PaymentMethodType | null
            >(null, Validators.required),
        });

        this.paymentMethodForm.controls.chosenPaymentMethod.valueChanges.subscribe(
            (value) => {
                this.newPaymentMethodFormVisible = Object.values(
                    PaymentMethodType,
                ).includes(value as PaymentMethodType)
                    ? (value as PaymentMethodType)
                    : null;
            },
        );
    }

    private initPaymentOptions() {
        this.newPaymentMethodOptions =
            paymentMethodTypesPerCategory.get(
                this.requiredCategory as PaymentMethodCategory,
            ) ?? [];
    }
}
