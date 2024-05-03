import { HttpClient } from '@angular/common/http';
import {
    Observable,
    ReplaySubject,
    catchError,
    map,
    of,
    take,
    tap,
} from 'rxjs';

export interface PaginationParameters {
    pageNumber: number;
    pageSize: number;
    maximumResults?: number;
    eager?: boolean;
}

export class PaginatedRequest<Entity> {
    private paginationParameters: PaginationParameters;
    private queryParameters: any;
    private http: HttpClient;
    private url: string;
    private factory: (input: any[]) => Entity[];
    private dataSubject: ReplaySubject<Entity[]> = new ReplaySubject<Entity[]>(
        1,
    );
    private isEager: boolean = false;

    public data$: Observable<Entity[]> = this.dataSubject.asObservable();

    constructor(
        http: HttpClient,
        url: string,
        factory: (input: any[]) => Entity[],
        queryParameters: any,
        paginationParameters: PaginationParameters,
    ) {
        this.http = http;
        this.url = url;
        this.factory = factory;
        this.queryParameters = queryParameters;
        this.paginationParameters = paginationParameters;
        if (paginationParameters.eager) {
            this.more();
            this.isEager = true; // do not invert order
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

    public more(): void {
        if (this.isEager) {
            this.isEager = false;
            return;
        }
        this.newRequest()
            .pipe(
                catchError((err) => {
                    this.dataSubject.error(err);
                    return of([]);
                }),
                take(1),
                tap(() => this.paginationParameters.pageNumber++),
            )
            .subscribe((data) => this.dataSubject.next(data));
    }

    public clear(): void {
        this.dataSubject.complete();
    }
}
