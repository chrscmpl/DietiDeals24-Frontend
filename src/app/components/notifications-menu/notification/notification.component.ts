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
export class NotificationComponent implements AfterViewInit {
    @Input({ required: true })
    public notification!: DisplayableNotification;
    @Output() public readonly loaded = new EventEmitter<number>();
    @Output() public readonly deleted = new EventEmitter<void>();

    public constructor() {}

    public ngAfterViewInit(): void {
        this.loaded.emit();
    }

    public onDelete(): void {
        this.deleted.emit();
    }
}
