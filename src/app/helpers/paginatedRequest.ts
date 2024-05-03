import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, ReplaySubject, finalize, map, of, take } from 'rxjs';

export interface PaginationParameters {
    pageNumber: number;
    pageSize: number;
    maximumResults?: number;
}

export class PaginatedRequest<Entity> {
    private paginationParameters: PaginationParameters;
    private queryParameters: any;
    private http: HttpClient;
    private url: string;
    private factory: (input: any[]) => Entity[];
    private eagerSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
    private useEager: boolean = false;

    constructor(
        http: HttpClient,
        url: string,
        factory: (input: any[]) => Entity[],
        queryParameters: any,
        paginationParameters: PaginationParameters,
        eager: boolean,
    ) {
        this.http = http;
        this.url = url;
        this.factory = factory;
        this.queryParameters = queryParameters;
        this.paginationParameters = paginationParameters;
        if (eager) {
            this.useEager = true;
            this.newRequest().subscribe({
                next: (data) => {
                    this.eagerSubject.next(data);
                },
                error: (error) => this.eagerSubject.next(error),
            });
        }
    }

    private wasMaximumResultsExceeded(): boolean {
        if (!this.paginationParameters.maximumResults) return false;
        return (
            this.paginationParameters.pageNumber *
                this.paginationParameters.pageSize >
            this.paginationParameters.maximumResults
        );
    }

    private makeHttpRequest(): Observable<any[]> {
        return this.http.get<any[]>(this.url, {
            params: {
                ...this.queryParameters,
                page: this.paginationParameters.pageNumber,
                pageSize: this.paginationParameters.pageSize,
            },
        });
    }

    private newRequest(): Observable<Entity[]> {
        return this.wasMaximumResultsExceeded()
            ? of([])
            : this.makeHttpRequest().pipe(map((data) => this.factory(data)));
    }

    private get eagerRequest(): Observable<Entity[]> {
        return this.eagerSubject.asObservable().pipe(
            take(1),
            map((data) => {
                if (
                    data instanceof HttpErrorResponse ||
                    data instanceof Error
                ) {
                    throw data;
                }
                return data;
            }),
            finalize(() => {
                this.eagerSubject.complete();
                this.useEager = false;
            }),
        );
    }

    public more(): Observable<Entity[]> {
        if (this.useEager) {
            return this.eagerRequest;
        }
        this.paginationParameters.pageNumber++;
        return this.newRequest();
    }

    // safety net necessary only if the request is eager and no
    // subscriptions to the observable returned by more() where made
    public clear(): void {
        this.eagerSubject.complete();
        this.useEager = false;
    }
}
