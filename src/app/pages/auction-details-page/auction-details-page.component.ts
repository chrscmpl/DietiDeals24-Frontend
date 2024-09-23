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
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
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
import { TransactionOperation } from '../../enums/transaction-operation.enum';
import { AuthenticationService } from '../../services/authentication.service';
import { AuctionStatus } from '../../enums/auction-status.enum';
import { NavigationService } from '../../services/navigation.service';
import { CategoriesService } from '../../services/categories.service';
import { RippleModule } from 'primeng/ripple';
import { AuctionStatusDescriptionPipe } from '../../pipes/auction-status-description.pipe';
import { AuctioneerService } from '../../services/auctioneer.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'dd24-auction-details-page',
    standalone: true,
    imports: [
        DialogModule,
        AsyncPipe,
        UserPreviewComponent,
        DividerModule,
        AuctionRuleSetLinkComponent,
        AuctionStatusDescriptionPipe,
        OneCharUpperPipe,
        TimerComponent,
        LocalDatePipe,
        ButtonModule,
        CarouselModule,
        NgTemplateOutlet,
        RippleModule,
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

    public readonly auctionStatus = AuctionStatus;

    public auction?: Auction;

    public currentPictureIndex: number = 0;

    public expandable: boolean = false;
    public expanded: boolean = false;

    public ownAuction: boolean = false;
    public isWinner: boolean = false;

    public carouselItems: { url: string; index: number; isEmpty?: boolean }[] =
        [];

    private errorPictureIndexes: number[] = [];

    public displayCarouselOverlay: boolean = false;

    public imageCarouselPage: number = 0;

    public isMacroCategory: boolean = false;

    public pendingEndTime: Date | null = null;

    public isPreview: boolean = false;

    @ViewChild('auctionDetailsContainer', { read: ElementRef })
    public containerElement!: ElementRef;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        public readonly windowService: WindowService,
        private readonly clipboard: Clipboard,
        private readonly message: MessageService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly authentication: AuthenticationService,
        private readonly navigation: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly auctioneerService: AuctioneerService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.auction = data['auction'];
            this.initCarousel();
            this.isMacroCategory = this.categoriesService.isMacroCategory(
                this.auction?.category ?? '',
            );

            if (this.auction?.status === Auction.STATUSES.pending) {
                this.pendingEndTime = new Date(
                    this.auction.endTime.getTime() +
                        environment.auctionPendingTime,
                );
            }
        });

        this.route.url.pipe(take(1)).subscribe((url) => {
            this.isPreview = url[url.length - 1].path === 'auction-preview';
        });

        this.subscriptions.push(
            this.windowService.isMobile$
                .pipe(filter((isMobile) => isMobile))
                .subscribe(() => {
                    this.expandable = false;
                }),
        );

        this.subscriptions.push(
            this.authentication.loggedUser$.subscribe((user) => {
                this.ownAuction = this.auction?.userId === user.id;
                this.isWinner = this.auction?.winnerId === user.id;
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
        this.router.navigate([{ outlets: { overlay: null } }], {
            queryParamsHandling: 'merge',
        });
    }

    public onShare(): void {
        this.windowService.isMobile$.pipe(take(1)).subscribe((isMobile) => {
            if (isMobile && navigator.share !== undefined) {
                this.shareUsingNavigator();
            } else {
                this.shareUsingClipboard();
            }
        });
    }

    private shareUsingClipboard(): void {
        this.clipboard.copy(`${location.origin}/auctions/${this.auction?.id}`);
        this.message.add({
            severity: 'info',
            summary: 'Link copied to clipboard',
        });
    }

    private shareUsingNavigator(): void {
        navigator
            .share({
                title: 'Share this auction',
                text: `Check out this auction: ${this.auction?.title}`,
                url: `${location.origin}/auctions/${this.auction?.id}`,
            })
            .catch(() => this.shareUsingClipboard());
    }

    public onDelete(): void {
        this.auctioneerService
            .showAbortDialog(this.auction!.id)
            .subscribe(this.onClose.bind(this));
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
        this.navigateToTransactionPage(TransactionOperation.bid);
    }

    public onConclude(): void {
        this.navigateToTransactionPage(TransactionOperation.conclude);
    }

    private navigateToTransactionPage(operation: TransactionOperation): void {
        this.navigation.savedRoute = this.navigation.primaryOutletRoute;
        this.router.navigate([
            {
                outlets: {
                    overlay: null,
                    primary: ['txn', this.auction?.id, operation],
                },
            },
        ]);
    }

    public onMessage(): void {
        this.router.navigate([
            {
                outlets: {
                    overlay: null,
                    primary: ['message', this.auction?.id],
                },
            },
        ]);
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
