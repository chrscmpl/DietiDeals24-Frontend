import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import { NotificationsService } from '../../services/notifications.service';
import { ButtonModule } from 'primeng/button';
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
        NotificationsListComponent,
    ],
    templateUrl: './notifications-menu.component.html',
    styleUrl: './notifications-menu.component.scss',
})
export class NotificationsMenuComponent {
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
}
