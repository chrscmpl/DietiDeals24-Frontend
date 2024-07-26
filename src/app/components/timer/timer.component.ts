import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IntervalPipe } from '../../pipes/interval.pipe';

@Component({
    selector: 'dd24-timer',
    standalone: true,
    imports: [IntervalPipe],
    templateUrl: './timer.component.html',
    styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit, OnDestroy {
    @Input({ required: true }) timeLeft!: number;
    private timerTimeout!: ReturnType<typeof setTimeout>;
    private timerInterval?: ReturnType<typeof setInterval>;

    public ngOnInit(): void {
        this.timerTimeout = setTimeout(() => {
            this.timerInterval = setInterval(() => {
                this.timeLeft -= 60;
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                }
            }, 60000);
        }, this.timeLeft % 60);
    }

    public ngOnDestroy(): void {
        clearTimeout(this.timerTimeout);
        clearInterval(this.timerInterval);
    }
}
