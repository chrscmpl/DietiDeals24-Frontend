import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';

interface Categories {
    [key: string]: string[];
}

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    constructor(private http: HttpClient) {}

    private trendingCategoriesSubject = new ReplaySubject<string[]>(1);

    public trendingCategories$: Observable<string[]> =
        this.trendingCategoriesSubject.asObservable();

    public refreshTrendingCategories(cb?: Partial<Observer<string[]>>): void {
        this.http
            .get<string[]>('dd24-backend/info/trending-categories')
            .pipe(
                tap((value) => {
                    this.trendingCategoriesSubject.next(value);
                }),
            )
            .subscribe(cb);
    }

    private categoriesSubject = new ReplaySubject<Categories>(1);

    public categories$: Observable<Categories> =
        this.categoriesSubject.asObservable();

    public macroCategories$: Observable<string[]> = this.categories$.pipe(
        map((categories) => Object.keys(categories)),
    );

    public refreshCategories(cb?: Partial<Observer<Categories>>): void {
        this.http
            .get<Categories>('dd24-backend/categories')
            .pipe(
                map((categories) => {
                    const sorted: Categories = {};
                    Object.keys(categories).forEach((key) => {
                        sorted[key] = categories[key].sort();
                    });
                    return sorted;
                }),
                tap((value) => {
                    this.categoriesSubject.next(value);
                }),
            )
            .subscribe(cb);
    }
}
