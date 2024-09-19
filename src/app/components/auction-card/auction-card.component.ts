import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Auction } from '../../models/auction.model';
import { AuctionRuleSetLinkComponent } from '../auction-ruleset-link/auction-ruleset-link.component';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { WindowService } from '../../services/window.service';
import { Router } from '@angular/router';
import { TimerComponent } from '../timer/timer.component';
import { AuthenticationService } from '../../services/authentication.service';
import { TransactionOperation } from '../../enums/transaction-operation.enum';
import { AuctionStatusDescriptionPipe } from '../../pipes/auction-status-description.pipe';
import { ButtonModule } from 'primeng/button';
import { AuctioneerService } from '../../services/auctioneer.service';

@Component({
    selector: 'dd24-auction-card',
    standalone: true,
    imports: [
        CommonModule,
        AuctionRuleSetLinkComponent,
        OneCharUpperPipe,
        LocalDatePipe,
        AsyncPipe,
        TimerComponent,
        AuctionStatusDescriptionPipe,
        ButtonModule,
    ],
    templateUrl: './auction-card.component.html',
    styleUrl: './auction-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCardComponent implements OnInit {
    @Input({ required: true }) auction!: Auction;
    @Input() cardStyle: { [key: string]: string | number } = {};
    @Input() skipLocationChange: boolean = false;

    @Output() loaded = new EventEmitter<number>();
    public statuses = Auction.STATUSES;
    public showImagePlaceholder: boolean = false;

    constructor(
        public readonly windowService: WindowService,
        public readonly authentication: AuthenticationService,
        private readonly auctioneerService: AuctioneerService,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        this.loaded.emit();
    }

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }

    public onClick(): void {
        if (
            this.auction.userId &&
            this.auction.userId === this.authentication.loggedUser?.id &&
            this.auction.status === Auction.STATUSES.pending
        ) {
            this.navigateToConclusion();
        } else {
            this.navigateToDetails();
        }
    }

    public onDelete(even: Event) {
        even.stopPropagation();
        this.auctioneerService.showAbortDialog(this.auction.id);
    }

    private navigateToDetails(): void {
        this.router.navigate(
            [
                '',
                {
                    outlets: {
                        overlay: ['auctions', this.auction.id],
                    },
                },
            ],
            {
                skipLocationChange: this.skipLocationChange,
                queryParamsHandling: 'merge',
            },
        );
    }

    private navigateToConclusion(): void {
        this.router.navigate([
            '/',
            'txn',
            this.auction.id,
            TransactionOperation.conclude,
        ]);
    }
}
