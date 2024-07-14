import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { DisplayableNotification } from '../../../models/notification.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dd24-notification',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class NotificationComponent {
    @Input({ required: true })
    public notification!: DisplayableNotification;
    @Output() public readonly deleted = new EventEmitter<void>();
    @Output() public readonly read = new EventEmitter<void>();

    public constructor() {}

    public onDelete(): void {
        this.deleted.emit();
    }

    public onRead(): void {
        this.read.emit();
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onRead();
        }
    }
}
