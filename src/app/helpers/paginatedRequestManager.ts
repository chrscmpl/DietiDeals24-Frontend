import { Observer, ReplaySubject, Subscription } from 'rxjs';
import { PaginatedRequest, PaginatedRequestParams } from './paginatedRequest';
import { HttpErrorResponse } from '@angular/common/http';

export class PaginatedRequestManager<Entity> {
    private request: PaginatedRequest<Entity>;
    private readonly _elements: Entity[] = [];

    private readonly nextSubject = new ReplaySubject<Entity[]>(1);
    private readonly errorSubject = new ReplaySubject<HttpErrorResponse>(1);
    private readonly completeSubject = new ReplaySubject<void>(1);

    private readonly next$ = this.nextSubject.asObservable();
    private readonly error$ = this.errorSubject.asObservable();
    private readonly complete$ = this.completeSubject.asObservable();

    private readonly dataObserver: Observer<Entity[]> = {
        next: (data) => {
            this._elements.push(...data);
            this.nextSubject.next(data);
        },
        error: (err) => {
            this.errorSubject.next(err);
        },
        complete: () => {
            this.completeSubject.next();
        },
    };

    public constructor(paginationParams: PaginatedRequestParams<Entity>) {
        this.request = new PaginatedRequest<Entity>(paginationParams);
        this.request.data$.subscribe(this.dataObserver);
    }

    public get elements(): ReadonlyArray<Entity> {
        return this._elements;
    }

    public more(): void {
        this.request.more();
    }

    public refresh(): void {
        this.request.refresh();
        this.request.data$.subscribe(this.dataObserver);
    }

    public subscribeUninterrupted(
        observer: Partial<Observer<Entity[]>>,
    ): Subscription {
        const subscription = new Subscription();
        if (observer.next)
            subscription.add(this.next$.subscribe(observer.next));
        if (observer.error)
            subscription.add(this.error$.subscribe(observer.error));
        if (observer.complete)
            subscription.add(this.complete$.subscribe(observer.complete));
        return subscription;
    }

    public reset(paginationParams?: PaginatedRequestParams<Entity>): void {
        this._elements.length = 0;
        if (!paginationParams) {
            this.request.reset();
            return;
        }
        this.request.complete();
        this.request = new PaginatedRequest<Entity>(paginationParams);
        this.request.data$.subscribe(this.dataObserver);
    }

    public complete(): void {
        this.request.complete();
        this.nextSubject.complete();
        this.errorSubject.complete();
        this.completeSubject.complete();
    }
}
