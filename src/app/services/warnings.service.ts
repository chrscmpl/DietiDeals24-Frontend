import { Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { PaymentMethodType } from '../enums/payment-method-type.enum';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { paymentMethodTypesByCategory } from '../helpers/payment-method-types-by-category.helper';

@Injectable({
    providedIn: 'root',
})
export class WarningsService {
    private static readonly INITIAL_WARNING_COUNTER = 3;
    private static readonly INITIAL_WARNING_LIFE = 10 * 60 * 1000;
    private static readonly INITIAL_WARNING_ITEM_NAME = 'warn-again-counter';
    private static readonly TRANSACTION_WARNING_LIFE = 10 * 1000;

    constructor(private readonly messageService: MessageService) {}

    public showTransactionWarning(category?: PaymentMethodCategory): void {
        let paymentMethodTypes: PaymentMethodType[] = [];
        if (category)
            paymentMethodTypes =
                paymentMethodTypesByCategory.get(category) ?? [];

        let warningMessage =
            "This is a student project, not a real platform, and this transaction is fake. Please do not use real data. Payment methods' data will not be sent to any payment processor.";
        if (paymentMethodTypes.includes(PaymentMethodType.creditCard))
            warningMessage +=
                ' For credit cards, we will only store the last 4 digits of the card number.';
        else if (paymentMethodTypes.includes(PaymentMethodType.IBAN))
            warningMessage +=
                ' For IBANs, we may store the entire IBAN number or part of it.';

        this.showWarning({
            severity: 'warn',
            summary: 'This transaction is fake',
            detail: warningMessage,
            life: WarningsService.TRANSACTION_WARNING_LIFE,
        });
    }

    public showIBANexample(): void {
        this.showWarning({
            severity: 'warn',
            summary:
                'Since all transactions are fake, you can use this example IBAN',
            detail: 'IT60X0542811101000000123456',
            styleClass: 'mobile-select',
            life: WarningsService.TRANSACTION_WARNING_LIFE,
        });
    }

    public showInitialWarningIfFirstTimeLoaded(): void {
        const timesWarned: number = Number(
            localStorage.getItem(WarningsService.INITIAL_WARNING_ITEM_NAME) ??
                0,
        );

        if (timesWarned > 0) {
            localStorage.setItem(
                WarningsService.INITIAL_WARNING_ITEM_NAME,
                String(timesWarned - 1),
            );
            return;
        }

        this.showInitialWarning();

        localStorage.setItem(
            WarningsService.INITIAL_WARNING_ITEM_NAME,
            String(WarningsService.INITIAL_WARNING_COUNTER - 1),
        );
    }

    private showInitialWarning(): void {
        this.showWarning({
            severity: 'warn',
            summary: 'This is not a real e-commerce platform',
            detail: 'This is a student project, not a real platform. Please do not use real data. Any transaction you make will not be real.',
            life: WarningsService.INITIAL_WARNING_LIFE,
        });
    }

    private showWarning(warning: Message): void {
        if (environment.disableWarnings !== true)
            this.messageService.add(warning);
    }
}
