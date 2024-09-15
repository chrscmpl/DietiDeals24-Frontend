import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'dd24-profile-picture-input',
    standalone: true,
    imports: [AvatarModule, RippleModule],
    templateUrl: './profile-picture-input.component.html',
    styleUrl: './profile-picture-input.component.scss',
})
export class ProfilePictureInputComponent {
    @Input() public picture: string | null = null;
    @Input() public maxFileSize: number | null = null;
    @Output() public pictureSelection: EventEmitter<File> =
        new EventEmitter<File>();

    public constructor(private readonly message: MessageService) {}

    public onPictureSelection(e: Event): void {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (this.maxFileSize && file.size > this.maxFileSize) {
            this.message.add({
                severity: 'error',
                summary: 'File too large',
                detail: `Profile picture cannot exceed ${this.maxFileSize / (1024 * 1024)}MB`,
            });
            return;
        }

        this.pictureSelection.emit(file);
    }
}
