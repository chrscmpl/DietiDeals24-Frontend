import { Observer, ReplaySubject, Subscription } from 'rxjs';
import { PaginatedRequest, PaginatedRequestParams } from './paginated-request';
import { HttpErrorResponse } from '@angular/common/http';
import { UninterruptedResettableObserver } from './uninterrupted-resettable-observer';

export class PaginatedRequestManager<Entity> {
    private request: PaginatedRequest<Entity>;
    private readonly _elements: Entity[] = [];

    private readonly nextSubject = new ReplaySubject<Entity[]>(1);
    private readonly errorSubject = new ReplaySubject<HttpErrorResponse>(1);
    private readonly completeSubject = new ReplaySubject<void>(1);
    private readonly resetSubject = new ReplaySubject<void>(1);

    private readonly next$ = this.nextSubject.asObservable();
    private readonly error$ = this.errorSubject.asObservable();
    private readonly complete$ = this.completeSubject.asObservable();
    private readonly reset$ = this.resetSubject.asObservable();

    private dataSubscription?: Subscription;
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
        this.subscribeToData();
    }

    public get pageSize(): number {
        return this.request.pageSize;
    }

    public get elements(): ReadonlyArray<Entity> {
        return this._elements;
    }

    public get editableElements(): Entity[] {
        return this._elements;
    }

    public more(): void {
        this.request.more();
    }

    public refresh(): void {
        this.request.refresh();
        this.subscribeToData();
    }

    public subscribeUninterrupted(
        observer: Partial<UninterruptedResettableObserver<Entity[]>>,
    ): Subscription {
        const subscription = new Subscription();
        if (observer.next)
            subscription.add(this.next$.subscribe(observer.next));
        if (observer.error)
            subscription.add(this.error$.subscribe(observer.error));
        if (observer.complete)
            subscription.add(this.complete$.subscribe(observer.complete));
        if (observer.reset)
            subscription.add(this.reset$.subscribe(observer.reset));
        return subscription;
    }

    public reset(paginationParams?: PaginatedRequestParams<Entity>): void {
        this.unsubscribeFromData();
        this.resetSubject.next();
        this._elements.length = 0;
        if (!paginationParams) {
            this.request.reset();
        } else {
            this.request.complete();
            this.request = new PaginatedRequest<Entity>(paginationParams);
        }
        this.subscribeToData();
    }

    public get isComplete() {
        return this.request.isComplete;
    }

    public clear(): void {
        this.request.complete();
        this.nextSubject.complete();
        this.errorSubject.complete();
        this.completeSubject.complete();
        this.resetSubject.complete();
    }

    private subscribeToData(): void {
        this.dataSubscription = this.request.data$.subscribe(this.dataObserver);
    }

    private unsubscribeFromData(): void {
        this.dataSubscription?.unsubscribe();
    }
}
