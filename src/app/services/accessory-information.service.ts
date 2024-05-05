import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AccessoryInformationService {
    constructor(private http: HttpClient) {}

    private trendingCategoriesSubject = new ReplaySubject<string[]>(1);

    public trendingCategories$: Observable<string[]> =
        this.trendingCategoriesSubject.asObservable();

    public refreshTrendingCategories(cb?: Partial<Observer<string[]>>): void {
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
