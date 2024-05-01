import { BehaviorSubject, Observable, of, delay, switchMap } from 'rxjs';

export class LoadingIndicator {
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _timeout: number;

    public isLoading$: Observable<boolean> = this._isLoading$.pipe(
        switchMap((loading) => {
            if (loading) return of(true).pipe(delay(this._timeout));
            return of(false);
        }),
    );

    constructor(timeout: number = 100) {
        this._timeout = timeout;
    }
    start() {
        this._isLoading$.next(true);
    }
    stop() {
        this._isLoading$.next(false);
    }
}
