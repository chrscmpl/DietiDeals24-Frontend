import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { TransactionOperation } from '../enums/transaction-operation.enum';
import { Auction } from './auction.model';
import { PaymentMethod } from './payment-method.model';

export interface CheckoutInformation {
    auction: Auction;
    bidAmount: number;
    methods: PaymentMethod[];
    requiredCategory: PaymentMethodCategory;
    operation: TransactionOperation;
}
