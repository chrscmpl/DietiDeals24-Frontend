import { inject, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    ResolveFn,
    Router,
} from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { catchError, map, Observable, of, take, throwError } from 'rxjs';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { AuctionKind } from '../enums/auction-kind.enum';
import { TransactionOperation } from '../enums/transaction-operation.enum';
import { Auction } from '../models/auction.model';
import { CheckoutInformation } from '../models/checkout-information.model';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class CheckoutInformationResolver
    implements Resolve<CheckoutInformation>
{
    public constructor(
        private readonly payment: PaymentService,
        private readonly router: Router,
        private readonly message: MessageService,
    ) {}

    public resolve(
        route: ActivatedRouteSnapshot,
    ): Observable<CheckoutInformation> {
        const auction: Auction | undefined = route.data?.['auction'];

        const operation: string | undefined = route.url[0]?.path;

        let bidAmount: number | undefined =
            this.router.getCurrentNavigation()?.extras?.state?.['bidAmount'];

        if (operation === TransactionOperation.conclude && auction?.winningBid)
            bidAmount = auction.winningBid;

        const requiredCategory: PaymentMethodCategory | null =
            this.getRequiredPaymentMethodsCategory(auction?.kind, operation);

        if (
            !auction ||
            !Object.values(TransactionOperation).includes(
                operation as TransactionOperation,
            ) ||
            (!bidAmount && bidAmount !== 0) ||
            requiredCategory === null
        )
            return this.throwError();

        return this.payment.getPaymentMethods(requiredCategory).pipe(
            catchError(() => of([])),
            take(1),
            map((methods) => ({
                methods,
                requiredCategory,
                auction,
                bidAmount: bidAmount as number,
                operation: operation as TransactionOperation,
            })),
        );
    }

    private getRequiredPaymentMethodsCategory(
        auctionKind: AuctionKind | undefined,
        operation: string | undefined,
    ): PaymentMethodCategory | null {
        if (auctionKind === undefined || operation === undefined) return null;

        if (operation === TransactionOperation.bid) {
            return auctionKind === AuctionKind.buying
                ? PaymentMethodCategory.receiving
                : PaymentMethodCategory.paying;
        } else if (operation === TransactionOperation.conclude) {
            return auctionKind === AuctionKind.buying
                ? PaymentMethodCategory.paying
                : PaymentMethodCategory.receiving;
        }
        return null;
    }

    private throwError(): Observable<never> {
        const messageText = 'Invalid checkout operation';
        this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: messageText,
        });
        return throwError(() => new Error(messageText));
    }

    public static asResolveFn(options?: {
        useParent?: boolean;
    }): ResolveFn<CheckoutInformation> {
        return (route) =>
            inject(CheckoutInformationResolver).resolve(
                options?.useParent
                    ? (route.parent as ActivatedRouteSnapshot)
                    : route,
            );
    }
}
