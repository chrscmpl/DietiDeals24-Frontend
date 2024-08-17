import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categories {
    [key: string]: string[];
}

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    constructor(private readonly http: HttpClient) {
        this.refreshCategories();
    }

    private _trendingCategories: string[] | null = null;
    private _categories: Categories | null = null;

    public get trendingCategories(): string[] | null {
        return this._trendingCategories;
    }

    public get categories(): Categories | null {
        return this._categories;
    }

    public get macroCategories(): string[] | null {
        if (!this.categories) return null;
        return Object.keys(this.categories);
    }

    private trendingCategoriesSubject = new ReplaySubject<void>(1);
    private categoriesSubject = new ReplaySubject<void>(1);

    public categories$: Observable<Categories> = this.categoriesSubject
        .asObservable()
        .pipe(map(() => this.categories ?? {}));

    public macroCategories$: Observable<string[]> = this.categoriesSubject
        .asObservable()
        .pipe(map(() => this.macroCategories ?? []));

    public trendingCategories$: Observable<string[]> =
        this.trendingCategoriesSubject
            .asObservable()
            .pipe(map(() => this._trendingCategories ?? []));

    public refreshTrendingCategories(cb?: Partial<Observer<string[]>>): void {
        this.http
            .get<string[]>(
                `${environment.backendHost}/info/trending-categories`,
            )
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
            .get<Categories>(`${environment.backendHost}/categories`)
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

    public getMacroCategory(category: string): string | null {
        if (!this.categories) return null;
        return (
            Object.keys(this.categories).find(
                (key) =>
                    category === key ||
                    this.categories![key].includes(category),
            ) ?? null
        );
    }

    public isProduct(category: string): boolean {
        return this.getMacroCategory(category)?.toLowerCase() === 'products';
    }
}
