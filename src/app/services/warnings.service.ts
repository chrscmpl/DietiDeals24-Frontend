import { Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { TransactionOperation } from '../enums/transaction-operation.enum';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WarningsService {
    private static readonly INITIAL_WARNING_COUNTER = 5;
    private static readonly INITIAL_WARNING_LIFE = 10 * 60 * 1000;
    private static readonly INITIAL_WARNING_ITEM_NAME = 'warn-again-counter';

    constructor(private readonly messageService: MessageService) {}

    public showTransactionWarning(
        _: TransactionOperation,
        __: PaymentMethodCategory,
    ): void {}

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
