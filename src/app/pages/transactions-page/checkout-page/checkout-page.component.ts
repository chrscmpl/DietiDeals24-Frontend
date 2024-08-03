import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { combineLatest, take } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { WindowService } from '../../../services/window.service';
import { PaymentMethodOptionComponent } from '../../../components/payment-method-option/payment-method-option.component';
import { ChosenPaymentMethodDTO } from '../../../DTOs/payment-method.dto';
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

enum CheckoutOperation {
    bid,
    conclude,
}

interface PaymentMethodForm {
    chosenPaymentMethod: FormControl<ChosenPaymentMethodDTO | null>;
}

@Component({
    selector: 'dd24-checkout-page',
    standalone: true,
    imports: [
        CurrencyPipe,
        AsyncPipe,
        PaymentMethodOptionComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
    public readonly OPERATIONS = CheckoutOperation;
    public bidAmount?: number;
    public auction?: Auction;
    public operation?: CheckoutOperation;

    public paymentMethodForm!: FormGroup<PaymentMethodForm>;

    public paymentMethodOptions: PaymentMethod[] = [];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        public readonly windowService: WindowService,
        private readonly formBuilder: FormBuilder,
        private readonly payment: PaymentService,
    ) {}

    public ngOnInit(): void {
        this.bidAmount = window.history.state.bidAmount;

        if (this.route.parent?.parent?.data && this.route.parent?.url)
            combineLatest([
                this.route.parent.parent.data,
                this.route.parent.url,
            ])
                .pipe(take(1))
                .subscribe(([data, url]) => {
                    this.auction = data['auction'];

                    this.operation =
                        CheckoutOperation[
                            url[0].path as keyof typeof CheckoutOperation
                        ];

                    if (this.operation === CheckoutOperation.conclude)
                        this.bidAmount = this.auction?.winningBid ?? undefined;

                    if (
                        !this.auction ||
                        this.operation === undefined ||
                        this.bidAmount === undefined
                    )
                        this.router.navigate(['..'], {
                            relativeTo: this.route,
                        });

                    this.payment
                        .getPaymentMethods(
                            this.operation === CheckoutOperation.bid
                                ? PaymentMethodCategory.paying
                                : PaymentMethodCategory.receiving,
                        )
                        .pipe(take(1))
                        .subscribe((methods) => {
                            this.paymentMethodOptions = methods;
                        });
                });

        this.paymentMethodForm = this.formBuilder.group({
            chosenPaymentMethod: new FormControl<ChosenPaymentMethodDTO | null>(
                null,
                Validators.required,
            ),
        });
    }
}
