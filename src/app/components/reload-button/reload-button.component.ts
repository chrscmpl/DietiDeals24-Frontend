import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'dd24-reload-button',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './reload-button.component.html',
    styleUrl: './reload-button.component.scss',
})
export class ReloadButtonComponent implements OnDestroy {
    @Input() message: string = "Couldn't load data. Click to try again";
    @Output() reload = new EventEmitter<void>();
    private unSpinTimeout?: ReturnType<typeof setTimeout>;
    public spin: boolean = false;

    public emitReload(): void {
        this.spin = true;
        this.unSpinTimeout = setTimeout(() => {
            if (this) {
                this.spin = false;
                this.reload.emit();
            }
        }, 150);
    }

    public ngOnDestroy(): void {
        if (this.unSpinTimeout) clearTimeout(this.unSpinTimeout);
    }
}
