import { BehaviorSubject, Observable, of, delay, switchMap } from 'rxjs';

export class LoadingIndicator {
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _startDelay: number;

    public isLoading$: Observable<boolean> = this._isLoading$.pipe(
        switchMap((loading) => {
            if (loading) return of(true).pipe(delay(this._startDelay));
            return of(false);
        }),
    );

    public constructor(startDelay: number = 100) {
        this._startDelay = startDelay;
    }

    public start() {
        this._isLoading$.next(true);
    }

    public stop() {
        this._isLoading$.next(false);
    }

    public get startDelay(): number {
        return this._startDelay;
    }

    public set startDelay(value: number) {
        this._startDelay = value;
    }
}
