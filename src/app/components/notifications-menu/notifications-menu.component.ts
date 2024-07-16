import {
    AfterViewInit,
    Component,
    OnDestroy,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import { NotificationsService } from '../../services/notifications.service';
import { ButtonModule } from 'primeng/button';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'dd24-notifications-menu',
    standalone: true,
    imports: [
        BadgeModule,
        AsyncPipe,
        OverlayPanelModule,
        DividerModule,
        ButtonModule,
        NotificationsListComponent,
        RouterLink,
    ],
    templateUrl: './notifications-menu.component.html',
    styleUrl: './notifications-menu.component.scss',
})
export class NotificationsMenuComponent implements AfterViewInit, OnDestroy {
    @ViewChild('panel') private panel!: OverlayPanel;

    private subscriptions: Subscription[] = [];

    private removeScrollListener: () => void = () => {};

    public extraButtonsVisible: boolean = false;

    public constructor(
        public readonly authentication: AuthenticationService,
        public readonly notificationsService: NotificationsService,
        private readonly renderer: Renderer2,
    ) {}

    public ngAfterViewInit(): void {
        this.subscriptions = this.subscriptions.concat([
            this.panel.onShow.subscribe(this.onShow.bind(this)),
            this.panel.onHide.subscribe(this.onHide.bind(this)),
        ]);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.removeScrollListener();
    }

    public toggle(event: Event): void {
        this.panel.toggle(event);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.panel.toggle(event);
        }
    }

    public hide(): void {
        this.panel.hide();
    }

    public toggleExtraButtons() {
        this.extraButtonsVisible = !this.extraButtonsVisible;
    }

    private onShow() {
        this.removeScrollListener();
        this.removeScrollListener = this.renderer.listen(
            'window',
            'scroll',
            this.hide.bind(this),
        );
    }

    private onHide() {
        this.removeScrollListener();
    }
}
