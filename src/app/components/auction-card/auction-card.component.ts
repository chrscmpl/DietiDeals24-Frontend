import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
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

@Component({
    selector: 'dd24-auction-card',
    standalone: true,
    imports: [
        CommonModule,
        AuctionRuleSetLinkComponent,
        OneCharUpperPipe,
        LocalDatePipe,
        CurrencyPipe,
        AsyncPipe,
        TimerComponent,
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
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        this.loaded.emit();
    }

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }

    public onClick(): void {
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

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClick();
        }
    }
}
