import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { combineLatest, take } from 'rxjs';
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
import { PaymentService } from '../../../services/payment.service';
import { PaymentMethodCategory } from '../../../enums/payment-method-category.enum';
import { TransactionOperation } from '../../../enums/transaction-operation.enum';
import { PaymentMethodType } from '../../../enums/payment-method-type';
import { paymentMethodTypesPerCategory } from '../../../helpers/payment-method-types-per-category';
import { AuctionKindPipe } from '../../../pipes/auction-kind.pipe';
import { AuctionKind } from '../../../enums/auction-kind.enum';

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
        private readonly router: Router,
        public readonly windowService: WindowService,
        private readonly formBuilder: FormBuilder,
        private readonly payment: PaymentService,
    ) {}

    public ngOnInit(): void {
        this.initCheckoutOperation();

        this.initForm();
    }

    private initCheckoutOperation() {
        this.bidAmount = window.history.state.bidAmount;

        if (this.route.parent?.parent?.data && this.route.parent?.url)
            combineLatest([
                this.route.parent.parent.data,
                this.route.parent.url,
            ])
                .pipe(take(1))
                .subscribe(([data, url]) => {
                    this.auction = data['auction'];

                    this.operation = url[0].path as TransactionOperation;

                    if (this.operation === TransactionOperation.conclude)
                        this.bidAmount = this.auction?.winningBid ?? undefined;

                    this.initRequiredCategory();

                    if (this.invalidOperation())
                        this.router.navigate(['..'], {
                            relativeTo: this.route,
                        });

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

    private initRequiredCategory() {
        if (this.operation === TransactionOperation.bid) {
            this.requiredCategory =
                this.auction?.kind === AuctionKind.buying
                    ? PaymentMethodCategory.receiving
                    : PaymentMethodCategory.paying;
        } else if (this.operation === TransactionOperation.conclude) {
            this.requiredCategory =
                this.auction?.kind === AuctionKind.buying
                    ? PaymentMethodCategory.paying
                    : PaymentMethodCategory.receiving;
        }
    }

    private initPaymentOptions() {
        this.payment
            .getPaymentMethods(this.requiredCategory as PaymentMethodCategory)
            .pipe(take(1))
            .subscribe((methods) => {
                this.savedPaymentMethodOptions = methods;
            });

        this.newPaymentMethodOptions =
            paymentMethodTypesPerCategory.get(
                this.requiredCategory as PaymentMethodCategory,
            ) ?? [];
    }

    private invalidOperation(): boolean {
        return (
            !this.auction ||
            this.bidAmount === undefined ||
            !Object.values(TransactionOperation).includes(
                this.operation as TransactionOperation,
            ) ||
            !Object.values(PaymentMethodCategory).includes(
                this.requiredCategory as PaymentMethodCategory,
            )
        );
    }
}
