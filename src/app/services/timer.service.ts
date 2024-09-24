import { Injectable, NgZone } from '@angular/core';
import { interval, startWith, Subject, switchMap, timer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    private _nextMinute$ = new Subject<void>();

    public nextMinute$ = this._nextMinute$.asObservable();

    constructor(private readonly zone: NgZone) {
        this.zone.runOutsideAngular(() => {
            timer(60000 - (Date.now() % 60000))
                .pipe(switchMap(() => interval(60000).pipe(startWith(0))))
                .subscribe(() => this.zone.run(() => this._nextMinute$.next()));
        });
    }
}
