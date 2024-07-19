import { Observable, Observer, Subject } from 'rxjs';
import { PaginatedRequest, PaginatedRequestParams } from './paginatedRequest';

export class PaginatedRequestManager<Entity> {
    private readonly _request: PaginatedRequest<Entity>;
    private readonly _elements: Entity[] = [];
    private readonly _loadingEndedSubject: Subject<void> = new Subject<void>();
    private readonly _loadingEnded$: Observable<void> =
        this._loadingEndedSubject.asObservable();

    private readonly dataObserver: Observer<Entity[]> = {
        next: (data) => {
            this._elements.push(...data);
            this._loadingEndedSubject.next();
        },
        error: () => {
            this._loadingEndedSubject.next();
        },
        complete: () => {
            this._loadingEndedSubject.next();
        },
    };

    public constructor(paginationParams: PaginatedRequestParams<Entity>) {
        this._request = new PaginatedRequest<Entity>(paginationParams);
        this._request.data$.subscribe(this.dataObserver);
    }

    public get data$(): Observable<Entity[]> {
        return this._request.data$;
    }

    public get elements(): ReadonlyArray<Entity> {
        return this._elements;
    }

    public get loadingEnded$(): Observable<void> {
        return this._loadingEnded$;
    }

    public more(): void {
        this._request.more();
    }

    public refresh(): void {
        this._request.refresh();
    }

    public reset(): void {
        this._elements.length = 0;
        this._request.reset();
    }

    public complete(): void {
        this._loadingEndedSubject.complete();
        this._request.complete();
    }
}
