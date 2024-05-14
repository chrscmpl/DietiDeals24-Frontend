import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';

interface Categories {
    products: string[];
    services: string[];
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

    public categories$: Observable<Categories> = this.categoriesSubject
        .asObservable()
        .pipe(
            map((categories) => ({
                products: categories.products.sort(),
                services: categories.services.sort(),
            })),
        );

    public refreshCategories(cb?: Partial<Observer<Categories>>): void {
        this.http
            .get<Categories>('dd24-backend/info/categories')
            .pipe(
                tap((value) => {
                    this.categoriesSubject.next(value);
                }),
            )
            .subscribe(cb);
    }
}
