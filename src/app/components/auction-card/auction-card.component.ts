import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Auction } from '../../models/auction.model';
import { AuctionTypeLinkComponent } from '../auction-type-link/auction-type-link.component';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { IntervalPipe } from '../../pipes/interval.pipe';
import { MoneyPipe } from '../../pipes/money.pipe';

@Component({
  selector: 'dd24-auction-card',
  standalone: true,
  imports: [
    CommonModule,
    AuctionTypeLinkComponent,
    OneCharUpperPipe,
    LocalDatePipe,
    IntervalPipe,
    MoneyPipe,
  ],
  templateUrl: './auction-card.component.html',
  styleUrl: './auction-card.component.scss',
})
export class AuctionCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) auction!: Auction;
  statuses = Auction.STATUSES;
  timeLeft: number = 0;
  timerInterval: any;

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
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
