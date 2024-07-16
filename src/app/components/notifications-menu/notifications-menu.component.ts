import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { NotificationsService } from '../../services/notifications.service';
import { ButtonModule } from 'primeng/button';
import { ScrolledToBottomListenerDirective } from '../../directives/scrolled-to-bottom-listener.directive';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';

@Component({
    selector: 'dd24-notifications-menu',
    standalone: true,
    imports: [
        BadgeModule,
        AsyncPipe,
        OverlayPanelModule,
        DividerModule,
        ButtonModule,
        ScrolledToBottomListenerDirective,
        NotificationsListComponent,
    ],
    templateUrl: './notifications-menu.component.html',
    styleUrl: './notifications-menu.component.scss',
})
export class NotificationsMenuComponent implements AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    @ViewChild('panel') private panel!: OverlayPanel;

    @ViewChild('notificationsList')
    private notificationsList!: NotificationsListComponent;

    @ViewChild('notificationsList', { read: ElementRef })
    notificationsListElement!: ElementRef;

    public minHeight =
        20 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    public extraButtonsVisible: boolean = false;

    public constructor(
        public readonly authentication: AuthenticationService,
        public readonly notificationsService: NotificationsService,
        public readonly renderer: Renderer2,
    ) {}

    public ngAfterViewInit(): void {
        this.subscriptions.push(
            this.panel.onShow.subscribe(this.loadMoreIfTooShort.bind(this)),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public toggle(event: Event): void {
        this.panel.toggle(event);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.panel.toggle(event);
        }
    }

    public more() {
        this.notificationsList.more();
    }

    public hide(): void {
        this.panel.hide();
    }

    public toggleExtraButtons() {
        this.extraButtonsVisible = !this.extraButtonsVisible;
    }

    private loadMoreIfTooShort(): void {
        setTimeout(() => {
            const height =
                this.notificationsListElement?.nativeElement.scrollHeight ??
                Infinity;
            if (height < this.minHeight) {
                this?.more();
            }
        }, 1000);
    }
}
