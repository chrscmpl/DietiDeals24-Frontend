/* eslint-disable @typescript-eslint/no-explicit-any */
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

type DeserializerFn<Entity> = (input: any) => Entity[];

export interface PaginatedRequestParams<Entity> {
    http: HttpClient;
    url: string;
    deserializer?: DeserializerFn<Entity>;
    queryParameters: any;
    pageNumber: number;
    pageSize: number;
    maximumResults?: number;
    eager?: boolean;
}

export class PaginatedRequest<Entity> {
    private readonly pageNumber: number;
    private readonly _pageSize: number;
    private readonly maximumResults: number;
    private readonly queryParameters: any;
    private readonly http: HttpClient;
    private readonly url: string;
    private readonly deserializer?: DeserializerFn<Entity>;

    private dataSubject: ReplaySubject<Entity[]> = new ReplaySubject<Entity[]>(
        1,
    );
    private currentPage: number;
    private isEager: boolean = false;
    private _isComplete: boolean = false;

    public data$: Observable<Entity[]>;

    constructor(params: PaginatedRequestParams<Entity>) {
        this.data$ = this.createDataObservable();
        this.http = params.http;
        this.url = params.url;
        this.deserializer = params.deserializer;
        this.queryParameters = params.queryParameters;
        this._pageSize = params.pageSize;
        this.pageNumber = params.pageNumber;
        this.currentPage = params.pageNumber;
        this.maximumResults = params.maximumResults ?? Infinity;
        if (params.eager) {
            this.more();
            this.isEager = true; // do not invert order
        }
    }

    private createDataObservable(): Observable<Entity[]> {
        return this.dataSubject.asObservable();
    }

    private wasMaximumResultsExceeded(): boolean {
        return this.currentPage * this._pageSize > this.maximumResults;
    }

    private makeHttpRequest(): Observable<any[]> {
        return this.http.get<any[]>(this.url, {
            params: {
                ...this.queryParameters,
                page: this.currentPage,
                size: this._pageSize,
            },
        });
    }

    private newRequest(): Observable<Entity[]> {
        if (this.wasMaximumResultsExceeded()) return of([]);
        if (this.deserializer) {
            return this.makeHttpRequest().pipe(
                map((data) => this.deserializer?.(data) ?? data),
            );
        }
        return this.makeHttpRequest();
    }

    public get pageSize(): number {
        return this._pageSize;
    }

    public more(): void {
        if (this.isComplete) return;
        if (this.isEager) {
            this.isEager = false;
            return;
        }
        this.newRequest()
            .pipe(
                catchError((err) => {
                    this.currentPage--;
                    this.dataSubject.error(err);
                    this._isComplete = true;
                    return of([]);
                }),
                take(1),
                tap(() => this.currentPage++),
            )
            .subscribe((data) => this.dataSubject.next(data));
    }

    public refresh(): void {
        this.isEager = false;
        this._isComplete = false;
        this.dataSubject.complete();
        this.dataSubject = new ReplaySubject<Entity[]>(1);
        this.data$ = this.createDataObservable();
    }

    public reset(): void {
        this.currentPage = this.pageNumber;
        this.refresh();
    }

    public complete(): void {
        this.dataSubject.complete();
        this._isComplete = true;
    }

    public get isComplete(): boolean {
        return this._isComplete;
    }
}
