import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { PaymentMethod } from '../models/payment-method.model';
import { PaymentService } from '../services/payment.service';
import { Observable, take, throwError } from 'rxjs';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { AuctionKind } from '../enums/auction-kind.enum';
import { TransactionOperation } from '../enums/transaction-operation.enum';

@Injectable()
export class CheckoutPaymentMethodsResolver
    implements Resolve<PaymentMethod[]>
{
    public constructor(private readonly payment: PaymentService) {}

    public resolve(route: ActivatedRouteSnapshot): Observable<PaymentMethod[]> {
        const requiredCategory: PaymentMethodCategory | null =
            this.getRequiredPaymentMethodsCategory(route);

        if (requiredCategory === null)
            return throwError(() => new Error('Invalid checkout operation'));

        return this.payment.getPaymentMethods(requiredCategory).pipe(take(1));
    }

    private getRequiredPaymentMethodsCategory(
        route: ActivatedRouteSnapshot,
    ): PaymentMethodCategory | null {
        const auctionKind: AuctionKind | undefined =
            route.parent?.parent?.data?.['auction']?.kind;

        const operation: TransactionOperation | undefined = route.parent?.url[0]
            ?.path as TransactionOperation | undefined;

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
}

export const checkoutPaymentMethodsResolverFn: ResolveFn<PaymentMethod[]> = (
    route,
) => {
    return inject(CheckoutPaymentMethodsResolver).resolve(route);
};
