import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { BidService } from '../../../services/bid.service';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';
import { NavigationService } from '../../../services/navigation.service';
import { AuctioneerService } from '../../../services/auctioneer.service';
import { AuctionConclusionOptions } from '../../../enums/auction-conclusion-options.enum';

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

    public error: string = '';

    public submissionLoading: boolean = false;

    constructor(
        private readonly route: ActivatedRoute,
        public readonly windowService: WindowService,
        private readonly formBuilder: FormBuilder,
        private readonly warning: WarningsService,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly paymentService: PaymentService,
        private readonly message: MessageService,
        private readonly bidService: BidService,
        private readonly auctioneerService: AuctioneerService,
        private readonly navigation: NavigationService,
        private readonly confirmation: ConfirmationService,
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
            this.onChosenMethodChanges.bind(this),
        );
    }

    private initPaymentOptions(): void {
        this.newPaymentMethodOptions =
            paymentMethodTypesByCategory.get(
                this.requiredCategory as PaymentMethodCategory,
            ) ?? [];
    }

    private onChosenMethodChanges(
        value: SavedChosenPaymentMethodDTO | PaymentMethodType | null,
    ) {
        if (this.error) this.error = '';
        this.newPaymentMethodFormVisible = this.isPaymentMethodType(value)
            ? (value as PaymentMethodType)
            : null;
        if (this.newPaymentMethodFormVisible !== null) {
            this.chosenPaymentMethodForm.get('newPaymentMethod')?.enable();
            this.changeDetector.detectChanges();
        } else this.chosenPaymentMethodForm.get('newPaymentMethod')?.disable();
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
            reactiveFormsUtils.markAllAsDirty(this.chosenPaymentMethodForm);
            if (
                this.chosenPaymentMethodForm.get('chosenPaymentMethod')?.invalid
            )
                this.error = 'Please select a payment method';
            return;
        }

        this.confirmation.confirm({
            header: 'Are you sure?',
            message:
                this.operation === TransactionOperation.bid
                    ? "You won't be able to cancel your bid later"
                    : "You won't be able to undo this action later",
            acceptButtonStyleClass: 'p-button-danger',
            accept: this.startTransaction.bind(this),
        });
    }

    private startTransaction() {
        this.submissionLoading = true;
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
                error: () => {
                    this.submissionLoading = false;
                    this.message.add({
                        severity: 'error',
                        summary: 'Authorization error',
                        detail: 'Payment authorization failed, check that the data is correct',
                    });
                },
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
                    this.navigation.navigateToRouteBeforeTransaction();
                    this.message.add({
                        severity: 'success',
                        summary: 'Bid placed',
                        detail: 'Your bid has been placed successfully',
                    });
                },
                error: () => {
                    this.submissionLoading = false;
                    this.message.add({
                        severity: 'error',
                        summary: 'Bid error',
                        detail: 'Failed to place bid, please try again later',
                    });
                },
            });
    }

    private concludeAuction(
        paymentMethod:
            | { savedPaymentMethod: SavedChosenPaymentMethodDTO }
            | { newPaymentMethod: NewChosenPaymentMethodDTO },
    ): void {
        this.auctioneerService
            .concludeAuction({
                choice: AuctionConclusionOptions.accept,
                auctionId: this.auction.id,
                ...paymentMethod,
            })
            .subscribe({
                next: () => {
                    this.navigation.navigateToRouteBeforeTransaction();
                    this.message.add({
                        severity: 'success',
                        summary: 'Bid accepted',
                        detail: 'You have accepted the winning bid',
                    });
                },
                error: () => {
                    this.submissionLoading = false;
                    this.message.add({
                        severity: 'error',
                        summary: 'Bid acceptance error',
                        detail: 'Failed to accept the bid, please try again later',
                    });
                },
            });
    }
}
