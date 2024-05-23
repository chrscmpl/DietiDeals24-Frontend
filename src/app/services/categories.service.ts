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

    private _trendingCategories: string[] = [];
    private _categories: Categories = {};

    public get trendingCategories(): string[] {
        return this._trendingCategories;
    }

    public get categories(): Categories {
        return this._categories;
    }

    public get macroCategories(): string[] {
        return Object.keys(this.categories);
    }

    private trendingCategoriesSubject = new ReplaySubject<void>(1);
    private categoriesSubject = new ReplaySubject<void>(1);

    public categories$: Observable<Categories> = this.categoriesSubject
        .asObservable()
        .pipe(map(() => this.categories));

    public macroCategories$: Observable<string[]> = this.categoriesSubject
        .asObservable()
        .pipe(map(() => this.macroCategories));

    public trendingCategories$: Observable<string[]> =
        this.trendingCategoriesSubject
            .asObservable()
            .pipe(map(() => this._trendingCategories));

    public refreshTrendingCategories(cb?: Partial<Observer<string[]>>): void {
        this.http
            .get<string[]>('dd24-backend/info/trending-categories')
            .pipe(
                tap((value) => {
                    this._trendingCategories = value;
                    this.trendingCategoriesSubject.next();
                }),
            )
            .subscribe(cb);
    }

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
                    this._categories = value;
                    this.categoriesSubject.next();
                }),
            )
            .subscribe(cb);
    }
}
