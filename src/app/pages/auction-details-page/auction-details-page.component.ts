import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { filter, Subscription, take } from 'rxjs';
import { WindowService } from '../../services/window.service';
import { AsyncPipe, CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { Auction } from '../../models/auction.model';
import { UserPreviewComponent } from '../../components/user-preview/user-preview.component';
import { DividerModule } from 'primeng/divider';
import { AuctionRuleSetLinkComponent } from '../../components/auction-ruleset-link/auction-ruleset-link.component';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { TimerComponent } from '../../components/timer/timer.component';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { ButtonModule } from 'primeng/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';
import { CarouselModule, CarouselPageEvent } from 'primeng/carousel';
import { UserSummary } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { TransactionOperation } from '../../enums/transaction-operation.enum';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'dd24-auction-details-page',
    standalone: true,
    imports: [
        DialogModule,
        AsyncPipe,
        UserPreviewComponent,
        DividerModule,
        AuctionRuleSetLinkComponent,
        CurrencyPipe,
        OneCharUpperPipe,
        TimerComponent,
        LocalDatePipe,
        ButtonModule,
        CarouselModule,
        NgTemplateOutlet,
    ],
    templateUrl: './auction-details-page.component.html',
    styleUrl: './auction-details-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionDetailsPageComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private static readonly EXPANDABLE_THRESHOLD = 30;
    private readonly subscriptions: Subscription[] = [];
    public display: boolean = true;

    public auction?: Auction;

    public user?: UserSummary;

    public timeLeft: number = 0;

    public currentPictureIndex: number = 0;

    public expandable: boolean = false;
    public expanded: boolean = false;

    public carouselItems: { url: string; index: number; isEmpty?: boolean }[] =
        [];

    private errorPictureIndexes: number[] = [];

    public displayCarouselOverlay: boolean = false;

    public imageCarouselPage: number = 0;

    @ViewChild('auctionDetailsContainer', { read: ElementRef })
    public containerElement!: ElementRef;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly userService: UserService,
        private readonly router: Router,
        public readonly windowService: WindowService,
        private readonly clipboard: Clipboard,
        private readonly message: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        public readonly authentication: AuthenticationService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
            this.initUser();
            this.initTimer();
            this.initCarousel();
        });

        this.subscriptions.push(
            this.windowService.isMobile$
                .pipe(filter((isMobile) => isMobile))
                .subscribe(() => {
                    this.expandable = false;
                }),
        );
    }

    public ngAfterViewInit(): void {
        const notExpandedHeight = Math.max(
            parseFloat(getComputedStyle(document.documentElement).fontSize) *
                50,
            window.innerHeight * 0.98,
        );
        const containerHeight =
            this.containerElement.nativeElement.offsetHeight;

        if (
            containerHeight >
            notExpandedHeight + AuctionDetailsPageComponent.EXPANDABLE_THRESHOLD
        ) {
            this.expandable = true;
            this.changeDetectorRef.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public onClose(): void {
        this.router.navigate([{ outlets: { overlay: null } }]);
    }

    public onShare(): void {
        this.clipboard.copy(`${location.origin}/auctions/${this.auction?.id}`);
        this.message.add({
            severity: 'info',
            summary: 'Link copied to clipboard',
        });
    }

    public onNextPicture(): void {
        if (
            this.currentPictureIndex <
            (this.auction?.picturesUrls.length ?? 0) - 1
        ) {
            this.currentPictureIndex++;
        }
    }

    public onPrevPicture(): void {
        if (this.currentPictureIndex > 0) {
            this.currentPictureIndex--;
        }
    }

    public onExpand(): void {
        this.expanded = true;
    }

    public onImageError(index: number): void {
        this.errorPictureIndexes.push(index);
    }

    public isPictureErrored(index: number): boolean {
        return this.errorPictureIndexes.includes(index);
    }

    public showCarouselOverlay() {
        this.displayCarouselOverlay = true;
    }

    public hideCarouselOverlay() {
        this.displayCarouselOverlay = false;
    }

    public hideCarouselOverlayKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter') this.hideCarouselOverlay();
    }

    public showCarouselOverlayKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter') this.showCarouselOverlay();
    }

    public onImageCarouselNavigation(e: CarouselPageEvent) {
        if (typeof e.page === 'number') this.imageCarouselPage = e.page;
    }

    public onBid(): void {
        this.router.navigate([
            {
                outlets: {
                    overlay: null,
                    primary: [
                        'txn',
                        this.auction?.id,
                        TransactionOperation.bid,
                    ],
                },
            },
        ]);
    }

    private initUser() {
        if (this.auction?.userId)
            this.userService
                .getSummary(this.auction.userId)
                .pipe(take(1))
                .subscribe((user) => {
                    this.user = user;
                    this.changeDetectorRef.detectChanges();
                });
    }

    private initTimer() {
        if (!this.auction) return;
        this.timeLeft = this.auction.endTime.getTime() - Date.now();
    }

    private initCarousel() {
        this.carouselItems =
            this.auction?.picturesUrls.map((url, index) => ({
                url,
                index,
            })) ?? [];
        if (!this.carouselItems.length)
            this.carouselItems.push({ url: '', index: 0, isEmpty: true });
    }
}
