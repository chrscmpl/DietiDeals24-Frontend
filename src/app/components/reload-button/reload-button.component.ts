import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'dd24-reload-button',
    standalone: true,
    imports: [],
    templateUrl: './reload-button.component.html',
    styleUrl: './reload-button.component.scss',
})
export class ReloadButtonComponent {
    @Input() message: string = "Could'nt load data. Click to try again";
    @Output() reload = new EventEmitter<void>();
    spin: boolean = false;

    emitReload(): void {
        this.spin = true;
        setTimeout(() => {
            this.spin = false;
        }, 150);
        this.reload.emit();
    }
}
