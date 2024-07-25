import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { take } from 'rxjs';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { Auction } from '../../models/auction.model';

@Component({
    selector: 'dd24-auction-details-page',
    standalone: true,
    imports: [DialogModule, AsyncPipe],
    templateUrl: './auction-details-page.component.html',
    styleUrl: './auction-details-page.component.scss',
})
export class AuctionDetailsPageComponent implements OnInit {
    public display: boolean = true;

    public auction: Auction | null = null;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        public readonly windowService: WindowService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
        });
    }

    public onClose(): void {
        this.router.navigate([{ outlets: { overlay: null } }]);
    }
}
