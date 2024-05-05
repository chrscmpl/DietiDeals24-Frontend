import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from 'rxjs';

interface CategoriesSubscribeCallbacks {
    next?: (data: string[]) => void;
    error?: (err: any) => void;
}

@Injectable({
    providedIn: 'root',
})
export class AccessoryInformationService {
    constructor(private http: HttpClient) {}

    private trendingCategoriesSubject = new ReplaySubject<string[]>(1);

    public trendingCategories$: Observable<string[]> =
        this.trendingCategoriesSubject.asObservable();

    public refreshTrendingCategories(cb?: CategoriesSubscribeCallbacks): void {
        this.http
            .get<string[]>('dd24-backend/info')
            .pipe(
                tap((value) => {
                    this.trendingCategoriesSubject.next(value);
                }),
            )
            .subscribe(cb);
    }
}
