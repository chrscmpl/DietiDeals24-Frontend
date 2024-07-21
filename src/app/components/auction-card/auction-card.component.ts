import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { AuctionSummary } from '../../models/auction.model';
import { AuctionTypeLinkComponent } from '../auction-type-link/auction-type-link.component';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { IntervalPipe } from '../../pipes/interval.pipe';
import { WindowService } from '../../services/window.service';

@Component({
    selector: 'dd24-auction-card',
    standalone: true,
    imports: [
        CommonModule,
        AuctionTypeLinkComponent,
        OneCharUpperPipe,
        LocalDatePipe,
        IntervalPipe,
        CurrencyPipe,
        AsyncPipe,
    ],
    templateUrl: './auction-card.component.html',
    styleUrl: './auction-card.component.scss',
})
export class AuctionCardComponent implements OnInit, OnDestroy {
    @Input({ required: true }) auction!: AuctionSummary;
    @Output() loaded = new EventEmitter<number>();
    public statuses = AuctionSummary.STATUSES;
    public timeLeft: number = 0;
    private timerInterval?: ReturnType<typeof setInterval>;
    public showImagePlaceholder: boolean = false;

    constructor(public readonly windowService: WindowService) {}

    ngOnInit(): void {
        this.timeLeft = this.auction.timeLeft;
        setTimeout(() => {
            this.timerInterval = setInterval(() => {
                this.timeLeft -= 60;
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                }
            }, 60000);
        }, this.timeLeft % 60);
        this.loaded.emit();
    }

    ngOnDestroy(): void {
        clearInterval(this.timerInterval);
    }

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }
}
