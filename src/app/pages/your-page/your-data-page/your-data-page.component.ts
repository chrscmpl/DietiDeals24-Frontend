import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { EditUserDataFormComponent } from '../../../components/edit-user-data-form/edit-user-data-form.component';
import { WindowService } from '../../../services/window.service';
import { PaymentMethod } from '../../../models/payment-method.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { MaskedPipe } from '../../../pipes/masked.pipe';
import { PaymentMethodLabelPipe } from '../../../pipes/payment-method-label.pipe';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../../services/payment.service';
import { HttpException } from '../../../exceptions/http.exception';
import { PaymentMethodType } from '../../../enums/payment-method-type';
import {
    NewPaymentMethodForm,
    PaymentMethodFormComponent,
} from '../../../components/payment-method-forms/payment-method-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UnauthorizedPaymentMethod } from '../../../models/unauthorized-payment-method.model';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';

interface editYourDataForm {
    NewPaymentMethod: FormGroup<NewPaymentMethodForm>;
}

@Component({
    selector: 'dd24-your-data-page',
    standalone: true,
    imports: [
        EditUserDataFormComponent,
        ReactiveFormsModule,
        InputTextModule,
        MaskedPipe,
        PaymentMethodLabelPipe,
        ButtonModule,
        PaymentMethodFormComponent,
        RouterLink,
    ],
    templateUrl: './your-data-page.component.html',
    styleUrl: './your-data-page.component.scss',
})
export class YourDataPageComponent implements OnInit {
    public editYourDataForm!: FormGroup<editYourDataForm>;

    public savedPaymentMethods: PaymentMethod[] = [];

    public displayLoading = false;

    public readonly tabs: MenuItem[] = [
        {
            label: 'Public profile',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-public-profile'),
        },
        {
            label: 'Links',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-links'),
        },
        {
            label: 'Private area',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-private-area'),
        },
        {
            label: 'Payment methods',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-payment-methods'),
        },
        {
            label: 'Security & Privacy',
            routerLink: ['..', 'security-privacy'],
        },
    ];

    public newPaymentMethodFormShown: PaymentMethodType | null = null;

    public newPaymentMethodOptions = Object.values(PaymentMethodType);

    public constructor(
        public readonly windowService: WindowService,
        private readonly route: ActivatedRoute,
        private readonly message: MessageService,
        private readonly paymentService: PaymentService,
        private readonly formBuilder: FormBuilder,
        private readonly confirm: ConfirmationService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.savedPaymentMethods = data['paymentMethods'];
        });
        this.initForm();
    }

    public promptDeletePaymentMethod(paymentMethod: PaymentMethod): void {
        this.confirm.confirm({
            header: 'Are you sure?',
            message: 'Are you sure you want to delete this payment method?',
            accept: () => this.deletePaymentMethod(paymentMethod),
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptLabel: 'Delete',
            acceptIcon: 'pi pi-trash',
            rejectLabel: 'Go back',
            rejectIcon: 'pi pi-arrow-left',
        });
    }

    private deletePaymentMethod(paymentMethod: PaymentMethod): void {
        this.paymentService
            .deletePaymentMethod(paymentMethod)
            .pipe(switchMap(() => this.paymentService.getPaymentMethods()))
            .subscribe({
                next: (paymentMethods) => {
                    this.savedPaymentMethods = paymentMethods;
                    this.displaySuccess('Payment method deleted successfully');
                },
                error: (e) =>
                    this.displayError(
                        e,
                        'Failed to delete payment method, try again later',
                    ),
            });
    }

    public savePaymentMethod(): void {
        const newMethodForm =
            this.editYourDataForm.controls.NewPaymentMethod.controls.newMethod;

        if (!newMethodForm) return;

        if (!newMethodForm.valid) {
            reactiveFormsUtils.markAllAsDirty(newMethodForm);
            return;
        }

        const unauthorizedPaymentMethod = UnauthorizedPaymentMethod.from(
            newMethodForm.value,
        );

        if (!unauthorizedPaymentMethod) return;

        this.paymentService
            .authorizePayment(unauthorizedPaymentMethod)
            .pipe(
                switchMap((authorizedPaymentMethod) =>
                    this.paymentService.savePaymentMethod(
                        authorizedPaymentMethod,
                    ),
                ),
                switchMap(() => this.paymentService.getPaymentMethods()),
            )
            .subscribe({
                next: (paymentMethods) => {
                    this.newPaymentMethodFormShown = null;
                    this.savedPaymentMethods = paymentMethods;
                    this.displaySuccess('Payment method saved successfully');
                },
                error: (e) =>
                    this.displayError(
                        e,
                        'Failed to save payment method, try again later',
                    ),
            });
    }

    private initForm(): void {
        this.editYourDataForm = this.formBuilder.group({
            NewPaymentMethod: new FormGroup<NewPaymentMethodForm>({}),
        });
    }

    private displaySuccess(message: string): void {
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
        });
    }

    private displayError(error: HttpException, message: string): void {
        if (error.error?.status === 0) {
            this.message.add({
                severity: 'error',
                summary: 'Network error',
                detail: 'Check your internet connection and try again',
            });
        } else {
            this.message.add({
                severity: 'error',
                summary: 'An error occurred',
                detail: message,
            });
        }
    }
}
