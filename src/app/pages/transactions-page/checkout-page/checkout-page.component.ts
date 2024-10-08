import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { Observable, of, switchMap, take } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { WindowService } from '../../../services/window.service';
import { PaymentMethodOptionComponent } from '../../../components/payment-method-option/payment-method-option.component';

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
import { PaymentMethodType } from '../../../enums/payment-method-type.enum';
import { paymentMethodTypesByCategory } from '../../../helpers/payment-method-types-by-category.helper';
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
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils.helper';
import { NavigationService } from '../../../services/navigation.service';
import { AuctioneerService } from '../../../services/auctioneer.service';
import { PaymentAuthorizationException } from '../../../exceptions/payment-authorization.exception';
import { BidPlacementException } from '../../../exceptions/bid-placement.exception';
import { BidAcceptanceException } from '../../../exceptions/bid-acceptance.exception';
import { UnauthorizedPaymentMethod } from '../../../models/unauthorized-payment-method.model';
import { AuthorizedPaymentMethod } from '../../../models/authorized-payment-method.model';
import { BidCreationData } from '../../../models/bid-creation-data.model';
import { AuctionAcceptanceData } from '../../../models/auction-acceptance-data.model';

interface PaymentMethodForm {
    chosenPaymentMethod: FormControl<{ id: string } | PaymentMethodType | null>;
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
                { id: string } | PaymentMethodType | null
            >(null, Validators.required),
            newPaymentMethod: this.formBuilder.group({
                save: new FormControl<boolean | null>(false),
            }) as FormGroup<NewPaymentMethodForm>,
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
        value: { id: string } | PaymentMethodType | null,
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

    private getSavedPaymentMethodId(): string {
        return (
            (
                this.chosenPaymentMethodForm.get('chosenPaymentMethod')
                    ?.value as {
                    id: string;
                }
            )?.id ?? ''
        );
    }

    private getNewPaymentMethod(): UnauthorizedPaymentMethod | null {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unauthorizedPaymentMethod: any = this.chosenPaymentMethodForm
            .get('newPaymentMethod')
            ?.get('newMethod')?.value;

        return unauthorizedPaymentMethod
            ? UnauthorizedPaymentMethod.from(unauthorizedPaymentMethod)
            : null;
    }

    private getSave(): boolean {
        return (
            this.chosenPaymentMethodForm.get('newPaymentMethod')?.get('save')
                ?.value ?? false
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
            accept: this.startOperation.bind(this),
            dismissableMask: true,
            closeOnEscape: true,
        });
    }

    private startOperation() {
        this.submissionLoading = true;
        this.getPaymentMethod$()
            .pipe(switchMap(this.performOperation$.bind(this)))
            .subscribe({
                next: this.onOperationSuccess.bind(this),
                error: this.onOperationError.bind(this),
            });
    }

    private getPaymentMethod$(): Observable<string | AuthorizedPaymentMethod> {
        if (
            !this.isPaymentMethodType(
                this.chosenPaymentMethodForm.get('chosenPaymentMethod')?.value,
            )
        ) {
            return of(this.getSavedPaymentMethodId());
        }

        return this.paymentService.authorizePayment(
            this.getNewPaymentMethod()!,
        );
    }

    private performOperation$(
        paymentMethod: string | AuthorizedPaymentMethod,
    ): Observable<unknown> {
        return this.operation === TransactionOperation.bid
            ? this.bidService.placeBid(
                  new BidCreationData(
                      this.auction.id,
                      this.bidAmount,
                      typeof paymentMethod === 'string'
                          ? { id: paymentMethod }
                          : { data: paymentMethod, save: this.getSave() },
                  ),
              )
            : this.auctioneerService.acceptBid(
                  new AuctionAcceptanceData(
                      this.auction.id,
                      typeof paymentMethod === 'string'
                          ? { id: paymentMethod }
                          : { data: paymentMethod, save: this.getSave() },
                  ),
              );
    }

    private onOperationSuccess() {
        if (this.operation === TransactionOperation.conclude) {
            this.navigation.savedRoute = null;
            this.router
                .navigate(['/'])
                .then(() => this.router.navigate(['message', this.auction.id]));
        } else {
            this.navigation.navigateToSavedRoute();
        }
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail:
                this.operation === TransactionOperation.bid
                    ? 'Your bid has been placed successfully'
                    : 'You have accepted the winning bid',
        });
    }

    private onOperationError(
        e:
            | PaymentAuthorizationException
            | BidPlacementException
            | BidAcceptanceException,
    ) {
        this.submissionLoading = false;

        if (e.error?.status === 0) {
            this.message.add({
                severity: 'error',
                summary: 'Network error',
                detail: 'Check your connection and try again',
            });
        } else {
            this.message.add({
                severity: 'error',
                summary: 'An error occurred',
                detail:
                    e instanceof PaymentAuthorizationException
                        ? 'Payment authorization failed, check that the data is correct'
                        : e instanceof BidPlacementException
                          ? 'Failed to place bid, please try again later'
                          : e instanceof BidAcceptanceException
                            ? 'Failed to accept the bid, please try again later'
                            : 'An error occurred',
            });
        }
    }
}
