import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { IntervalPipe } from '../../pipes/interval.pipe';

@Component({
    selector: 'dd24-timer',
    standalone: true,
    imports: [IntervalPipe],
    templateUrl: './timer.component.html',
    styleUrl: './timer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit, OnDestroy {
    public timeAmount: number = 0;
    @Input({ required: true }) timeLeft: number = 0;
    private timerTimeout!: ReturnType<typeof setTimeout>;
    private timerInterval?: ReturnType<typeof setInterval>;

    constructor(private readonly changeDetector: ChangeDetectorRef) {}

    public ngOnInit(): void {
        this.timeAmount = this.timeLeft;
        this.timerTimeout = setTimeout(() => {
            this.timerInterval = setInterval(() => {
                this.timeAmount -= 60;
                this.changeDetector.markForCheck();
                if (this.timeAmount <= 0) {
                    clearInterval(this.timerInterval);
                }
            }, 60000);
        }, this.timeAmount % 60);
    }

    public ngOnDestroy(): void {
        clearTimeout(this.timerTimeout);
        clearInterval(this.timerInterval);
    }
}
