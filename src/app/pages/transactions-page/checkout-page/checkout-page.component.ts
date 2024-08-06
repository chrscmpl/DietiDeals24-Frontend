import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { take } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { WindowService } from '../../../services/window.service';
import { PaymentMethodOptionComponent } from '../../../components/payment-method-option/payment-method-option.component';
import {
    NewChosenPaymentMethodDTO,
    SavedChosenPaymentMethodDTO,
    UnauthorizedPaymentMethodRegistrationDTO,
} from '../../../DTOs/payment-method.dto';
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
import { paymentMethodTypesByCategory } from '../../../helpers/payment-method-types-by-category';
import { AuctionKindPipe } from '../../../pipes/auction-kind.pipe';
import { CheckoutInformation } from '../../../models/checkout-information.model';
import { WarningsService } from '../../../services/warnings.service';
import {
    NewPaymentMethodForm,
    PaymentMethodFormComponent,
} from '../../../components/payment-method-forms/payment-method-form.component';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../../services/payment.service';
import { MessageService } from 'primeng/api';
import { BidService } from '../../../services/bid.service';

interface PaymentMethodForm {
    chosenPaymentMethod: FormControl<
        SavedChosenPaymentMethodDTO | PaymentMethodType | null
    >;
    newPaymentMethod: FormGroup<NewPaymentMethodForm>;
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
        PaymentMethodFormComponent,
        ButtonModule,
    ],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
    public readonly OPERATIONS = TransactionOperation;
    public readonly PAYMENT_METHOD_CATEGORIES = PaymentMethodCategory;
    public bidAmount!: number;
    public auction!: Auction;
    public operation!: TransactionOperation;
    public requiredCategory!: PaymentMethodCategory;

    public chosenPaymentMethodForm!: FormGroup<PaymentMethodForm>;

    public savedPaymentMethodOptions: PaymentMethod[] = [];

    public newPaymentMethodOptions: PaymentMethodType[] = [];

    public newPaymentMethodFormVisible?: null | PaymentMethodType = null;

    constructor(
        private readonly route: ActivatedRoute,
        public readonly windowService: WindowService,
        private readonly formBuilder: FormBuilder,
        private readonly warning: WarningsService,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly paymentService: PaymentService,
        private readonly message: MessageService,
        private readonly bidService: BidService,
        private readonly router: Router,
    ) {}

    public ngOnInit(): void {
        this.initCheckoutOperation();

        this.initForm();
    }

    private initCheckoutOperation(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            const checkoutInformation = data[
                'checkoutInformation'
            ] as CheckoutInformation;

            this.auction = checkoutInformation.auction;
            this.bidAmount = checkoutInformation.bidAmount;
            this.operation = checkoutInformation.operation;
            this.requiredCategory = checkoutInformation.requiredCategory;
            this.savedPaymentMethodOptions = checkoutInformation.methods;

            this.warning.showTransactionWarning(this.requiredCategory);

            this.initPaymentOptions();
        });
    }

    private initForm(): void {
        this.chosenPaymentMethodForm = this.formBuilder.group({
            chosenPaymentMethod: new FormControl<
                SavedChosenPaymentMethodDTO | PaymentMethodType | null
            >(null, Validators.required),
            newPaymentMethod: this.formBuilder.group({
                save: new FormControl<boolean | null>(false),
            }),
        });

        this.chosenPaymentMethodForm.controls.chosenPaymentMethod.valueChanges.subscribe(
            (value) => {
                this.newPaymentMethodFormVisible = this.isPaymentMethodType(
                    value,
                )
                    ? (value as PaymentMethodType)
                    : null;
                if (this.newPaymentMethodFormVisible !== null)
                    this.changeDetector.detectChanges();
            },
        );
    }

    private initPaymentOptions(): void {
        this.newPaymentMethodOptions =
            paymentMethodTypesByCategory.get(
                this.requiredCategory as PaymentMethodCategory,
            ) ?? [];
    }

    public get newPaymentMethodFormGroup(): FormGroup {
        return this.chosenPaymentMethodForm.get(
            'newPaymentMethod',
        ) as FormGroup;
    }

    private isPaymentMethodType(value: unknown): boolean {
        return Object.values(PaymentMethodType).includes(
            value as PaymentMethodType,
        );
    }

    public onSubmit(): void {
        if (this.chosenPaymentMethodForm.invalid) {
            this.chosenPaymentMethodForm.markAllAsTouched();
            return;
        }

        if (
            this.isPaymentMethodType(
                this.chosenPaymentMethodForm.get('chosenPaymentMethod')?.value,
            )
        ) {
            this.authorizePaymentAndPerformOperation();
            return;
        }

        this.performOperation({
            savedPaymentMethod: this.chosenPaymentMethodForm.get(
                'chosenPaymentMethod',
            )?.value as SavedChosenPaymentMethodDTO,
        });
    }

    private authorizePaymentAndPerformOperation() {
        this.paymentService
            .authorizePayment(
                this.chosenPaymentMethodForm
                    .get('newPaymentMethod')
                    ?.get('newMethod')
                    ?.value as UnauthorizedPaymentMethodRegistrationDTO,
            )
            .subscribe({
                next: (paymentMethod) =>
                    this.performOperation({
                        newPaymentMethod: {
                            save:
                                this.chosenPaymentMethodForm
                                    .get('newPaymentMethod')
                                    ?.get('save')?.value ?? false,
                            newMethod: paymentMethod,
                        },
                    }),
                error: () =>
                    this.message.add({
                        severity: 'error',
                        summary: 'Authorization error',
                        detail: 'Payment authorization failed',
                    }),
            });
    }

    private performOperation(
        paymentMethod:
            | { savedPaymentMethod: SavedChosenPaymentMethodDTO }
            | { newPaymentMethod: NewChosenPaymentMethodDTO },
    ): void {
        if (this.operation === TransactionOperation.bid)
            this.createBid(paymentMethod);
        else if (this.operation === TransactionOperation.conclude)
            this.concludeAuction(paymentMethod);
    }

    private createBid(
        paymentMethod:
            | { savedPaymentMethod: SavedChosenPaymentMethodDTO }
            | { newPaymentMethod: NewChosenPaymentMethodDTO },
    ): void {
        this.bidService
            .createBid({
                auctionId: this.auction.id,
                amount: this.bidAmount,
                ...paymentMethod,
            })
            .subscribe({
                next: () => {
                    this.router.navigate(['/home']);
                    this.message.add({
                        severity: 'success',
                        summary: 'Bid placed',
                        detail: 'Your bid has been placed successfully',
                    });
                },
                error: () =>
                    this.message.add({
                        severity: 'error',
                        summary: 'Bid error',
                        detail: 'Failed to place bid',
                    }),
            });
    }

    private concludeAuction(
        paymentMethod:
            | { savedPaymentMethod: SavedChosenPaymentMethodDTO }
            | { newPaymentMethod: NewChosenPaymentMethodDTO },
    ): void {}
}
