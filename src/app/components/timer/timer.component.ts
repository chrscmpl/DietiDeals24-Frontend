import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { IntervalPipe } from '../../pipes/interval.pipe';
import { TimerService } from '../../services/timer.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'dd24-timer',
    standalone: true,
    imports: [IntervalPipe],
    templateUrl: './timer.component.html',
    styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit, OnDestroy {
    public timeAmount: number = 0;
    private timerSubscription!: Subscription;
    @Input({ required: true }) endDate!: Date;

    constructor(
        private readonly timer: TimerService,
        private readonly changeDetector: ChangeDetectorRef,
    ) {}

    public ngOnInit(): void {
        this.updateTimer();
        this.timerSubscription = this.timer.nextMinute$.subscribe(() => {
            this.updateTimer();
            this.changeDetector.detectChanges();
            if (this.timeAmount <= 0) this.timerSubscription.unsubscribe();
        });
    }

    private updateTimer(): void {
        this.timeAmount = Math.floor(
            (this.endDate.getTime() - Date.now()) / 1000,
        );
    }

    public ngOnDestroy(): void {
        this.timerSubscription.unsubscribe();
    }
}
