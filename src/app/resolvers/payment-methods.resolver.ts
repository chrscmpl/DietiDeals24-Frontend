import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/payment-method.model';
import { PaymentService } from '../services/payment.service';

@Injectable({
    providedIn: 'root',
})
export class PaymentMethodsResolver implements Resolve<PaymentMethod[]> {
    public constructor(private readonly paymentService: PaymentService) {}

    public resolve(): Observable<PaymentMethod[]> {
        return this.paymentService.getPaymentMethods();
    }

    public static asResolveFn(): ResolveFn<PaymentMethod[]> {
        return () => inject(PaymentMethodsResolver).resolve();
    }
}
