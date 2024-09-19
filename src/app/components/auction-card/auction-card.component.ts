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
import { environment } from '../../../environments/environment';

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
    @Input({ required: true }) public auction!: Auction;
    @Input() public cardStyle: { [key: string]: string | number } = {};
    @Input() public skipLocationChange: boolean = false;
    @Input() public showInfoBtn: boolean = false;
    @Input() public privateView: boolean = false;

    @Output() public loaded = new EventEmitter<number>();
    public statuses = Auction.STATUSES;
    public showImagePlaceholder: boolean = false;
    public pendingEndTime: Date | null = null;

    constructor(
        public readonly windowService: WindowService,
        public readonly authentication: AuthenticationService,
        private readonly auctioneerService: AuctioneerService,
        private readonly router: Router,
    ) {}

    public ngOnInit(): void {
        this.loaded.emit();
        if (this.auction.status === Auction.STATUSES.pending) {
            this.pendingEndTime = new Date(
                this.auction.endTime.getTime() + environment.auctionPendingTime,
            );
        }
    }

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }

    public onClick(): void {
        if (
            this.auction.userId &&
            this.auction.userId === this.authentication.loggedUser?.id &&
            this.auction.status === Auction.STATUSES.pending &&
            !this.router.url.includes('txn')
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
