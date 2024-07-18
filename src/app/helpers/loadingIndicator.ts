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

    public constructor(timeout: number = 100) {
        this._timeout = timeout;
    }

    public start() {
        this._isLoading$.next(true);
    }

    public stop() {
        this._isLoading$.next(false);
    }

    public get timeout(): number {
        return this._timeout;
    }

    public set timeout(value: number) {
        this._timeout = value;
    }
}
