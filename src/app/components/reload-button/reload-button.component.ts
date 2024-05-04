import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';

@Component({
    selector: 'dd24-reload-button',
    standalone: true,
    imports: [],
    templateUrl: './reload-button.component.html',
    styleUrl: './reload-button.component.scss',
})
export class ReloadButtonComponent implements OnDestroy {
    @Input() message: string = "Could'nt load data. Click to try again";
    @Output() reload = new EventEmitter<void>();
    private unSpinTimeout: any;
    public spin: boolean = false;

    emitReload(): void {
        this.spin = true;
        this.unSpinTimeout = setTimeout(() => {
            this.spin = false;
        }, 150);
        this.reload.emit();
    }

    ngOnDestroy(): void {
        if (this.unSpinTimeout) clearTimeout(this.unSpinTimeout);
    }
}
