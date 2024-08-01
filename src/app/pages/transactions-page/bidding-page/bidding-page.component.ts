import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auction } from '../../../models/auction.model';
import { take } from 'rxjs';
import { AuctionCardComponent } from '../../../components/auction-card/auction-card.component';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputComponent } from '../../../components/input/input.component';
import { OneCharUpperPipe } from '../../../pipes/one-char-upper.pipe';
import { FindCurrencyPipe } from '../../../pipes/find-currency.pipe';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CurrencyPipe, getCurrencySymbol } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface BidForm {
    amount: FormControl<number | null>;
}

@Component({
    selector: 'dd24-bidding-page',
    standalone: true,
    imports: [
        AuctionCardComponent,
        ReactiveFormsModule,
        InputNumberModule,
        InputComponent,
        OneCharUpperPipe,
        FindCurrencyPipe,
        InputGroupModule,
        InputGroupAddonModule,
        CurrencyPipe,
        ButtonModule,
    ],
    templateUrl: './bidding-page.component.html',
    styleUrl: './bidding-page.component.scss',
})
export class BiddingPageComponent implements OnInit {
    public auction?: Auction;
    public bidForm!: FormGroup<BidForm>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        @Inject(LOCALE_ID) public readonly locale: string,
    ) {}

    public ngOnInit(): void {
        this.route.parent?.parent?.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
        });
        this.bidForm = this.formBuilder.group({
            amount: new FormControl<number | null>(null, {
                validators: [
                    Validators.required,
                    this.validateBidAmount.bind(this),
                ],
                updateOn: 'submit',
            }),
        });
    }

    private validateBidAmount(): ValidationErrors | null {
        if (
            !this.auction ||
            !this.bidForm?.controls?.amount?.value ||
            this.auction.bidValid(this.bidForm.controls.amount.value)
        )
            return null;
        return { invalidBid: true };
    }

    public onSubmit(): void {}

    public get currencySymbol(): string {
        if (!this.auction) return '';
        return getCurrencySymbol(this.auction?.currency, 'narrow');
    }
}