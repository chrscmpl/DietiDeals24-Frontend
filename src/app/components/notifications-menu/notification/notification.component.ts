import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { DisplayableNotification } from '../../../models/notification.model';
import { RouterLink } from '@angular/router';
import { FindCurrencyPipe } from '../../../pipes/find-currency.pipe';

@Component({
    selector: 'dd24-notification',
    standalone: true,
    imports: [RouterLink, FindCurrencyPipe],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class NotificationComponent implements AfterViewInit {
    @Input({ required: true })
    public notification!: DisplayableNotification;
    @Output() public readonly deleted = new EventEmitter<void>();
    @Output() public readonly read = new EventEmitter<void>();
    @Output() public readonly loaded = new EventEmitter<void>();

    public constructor() {}

    public ngAfterViewInit(): void {
        this.loaded.emit();
    }

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
