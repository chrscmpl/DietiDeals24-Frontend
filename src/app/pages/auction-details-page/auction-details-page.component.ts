import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { take } from 'rxjs';
import { WindowService } from '../../services/window.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Auction } from '../../models/auction.model';
import { UserPreviewComponent } from '../../components/user-preview/user-preview.component';
import { DividerModule } from 'primeng/divider';
import { AuctionTypeLinkComponent } from '../../components/auction-type-link/auction-type-link.component';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { TimerComponent } from '../../components/timer/timer.component';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { ButtonModule } from 'primeng/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'dd24-auction-details-page',
    standalone: true,
    imports: [
        DialogModule,
        AsyncPipe,
        UserPreviewComponent,
        DividerModule,
        AuctionTypeLinkComponent,
        CurrencyPipe,
        OneCharUpperPipe,
        TimerComponent,
        LocalDatePipe,
        ButtonModule,
    ],
    templateUrl: './auction-details-page.component.html',
    styleUrl: './auction-details-page.component.scss',
})
export class AuctionDetailsPageComponent implements OnInit {
    public display: boolean = true;

    public auction!: Auction;

    public currentPictureIndex: number = 0;

    public showImagePlaceholder: boolean = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        public readonly windowService: WindowService,
        private readonly clipboard: Clipboard,
        private readonly message: MessageService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
        });
    }

    public onClose(): void {
        this.router.navigate([{ outlets: { overlay: null } }]);
    }

    public onShare(): void {
        this.clipboard.copy(window.location.href);
        this.message.add({
            severity: 'info',
            summary: 'Link copied to clipboard',
        });
    }

    public onNextPicture(): void {
        if (this.currentPictureIndex < this.auction.picturesUrls.length - 1) {
            this.currentPictureIndex++;
        }
    }

    public onPrevPicture(): void {
        if (this.currentPictureIndex > 0) {
            this.currentPictureIndex--;
        }
    }

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }
}
