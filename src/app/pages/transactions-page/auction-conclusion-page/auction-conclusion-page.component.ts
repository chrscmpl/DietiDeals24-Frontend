import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuctionCardComponent } from '../../../components/auction-card/auction-card.component';
import { AsyncPipe } from '@angular/common';
import { WindowService } from '../../../services/window.service';
import { Auction } from '../../../models/auction.model';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
    selector: 'dd24-auction-conclusion-page',
    standalone: true,
    imports: [ButtonModule, AuctionCardComponent, AsyncPipe],
    templateUrl: './auction-conclusion-page.component.html',
    styleUrl: './auction-conclusion-page.component.scss',
})
export class AuctionConclusionPageComponent implements OnInit {
    public auction!: Auction;

    public constructor(
        public readonly windowService: WindowService,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
        });
    }
}
