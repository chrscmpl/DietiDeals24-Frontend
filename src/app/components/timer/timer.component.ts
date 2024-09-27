import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { IntervalPipe } from '../../pipes/interval.pipe';
import { IntervalService } from '../../services/interval.service';
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
        private readonly timer: IntervalService,
        private readonly changeDetector: ChangeDetectorRef,
    ) {}

    public ngOnInit(): void {
        this.updateTimer();
        this.timerSubscription = this.timer.nextMinute$.subscribe(() => {
            this.updateTimer();
            this.changeDetector.markForCheck();
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
