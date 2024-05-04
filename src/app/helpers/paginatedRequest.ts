import { HttpClient } from '@angular/common/http';
import {
    Observable,
    ReplaySubject,
    catchError,
    finalize,
    map,
    of,
    take,
    tap,
} from 'rxjs';

export interface PaginatedRequestParams<Entity> {
    http: HttpClient;
    url: string;
    factory: (input: any[]) => Entity[];
    queryParameters: any;
    pageNumber: number;
    pageSize: number;
    maximumResults?: number;
    eager?: boolean;
}

export class PaginatedRequest<Entity> {
    private pageNumber: number;
    private pageSize: number;
    private currentPage: number = 0;
    private maximumResults: number;
    private queryParameters: any;
    private http: HttpClient;
    private url: string;
    private factory: (input: any[]) => Entity[];
    private dataSubject: ReplaySubject<Entity[]> = new ReplaySubject<Entity[]>(
        1,
    );
    private isEager: boolean = false;

    public data$: Observable<Entity[]>;

    constructor(params: PaginatedRequestParams<Entity>) {
        this.data$ = this.createDataObservable();
        this.http = params.http;
        this.url = params.url;
        this.factory = params.factory;
        this.queryParameters = params.queryParameters;
        this.pageSize = params.pageSize;
        this.pageNumber = params.pageNumber;
        this.currentPage = params.pageNumber;
        this.maximumResults = params.maximumResults ?? Infinity;
        if (params.eager) {
            this.more();
            this.isEager = true; // do not invert order
        }
    }

    private createDataObservable(): Observable<Entity[]> {
        return this.dataSubject
            .asObservable()
            .pipe(finalize(() => this.dataSubject.complete()));
    }

    private wasMaximumResultsExceeded(): boolean {
        return this.currentPage * this.pageSize > this.maximumResults;
    }

    private makeHttpRequest(): Observable<any[]> {
        return this.http.get<any[]>(this.url, {
            params: {
                ...this.queryParameters,
                page: this.currentPage,
                pageSize: this.pageSize,
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
                    this.currentPage--;
                    this.dataSubject.error(err);
                    return of([]);
                }),
                take(1),
                tap(() => this.currentPage++),
            )
            .subscribe((data) => this.dataSubject.next(data));
    }

    public refresh(): void {
        this.dataSubject.complete();
        this.dataSubject = new ReplaySubject<Entity[]>(1);
        this.data$ = this.createDataObservable();
    }

    public reset(): void {
        this.currentPage = this.pageNumber;
        this.refresh();
    }
}
