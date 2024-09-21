import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';
import { Cacheable } from 'ts-cacheable';

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

    private _categories: Categories | null = null;

    public get categories(): Categories | null {
        return this._categories;
    }

    public get macroCategories(): string[] | null {
        if (!this.categories) return null;
        return Object.keys(this.categories);
    }

    private categoriesSubject = new ReplaySubject<void>(1);

    public categories$: Observable<Categories> = this.categoriesSubject
        .asObservable()
        .pipe(map(() => this.categories ?? {}));

    public macroCategories$: Observable<string[]> = this.categoriesSubject
        .asObservable()
        .pipe(map(() => this.macroCategories ?? []));

    @Cacheable()
    public getTrendingCategories(): Observable<string[]> {
        return this.http.get<string[]>('categories/trending', {
            params: { amount: 16 },
        });
    }

    public refreshCategories(cb?: Partial<Observer<Categories>>): void {
        this.http
            .get<Categories>('categories/all')
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

    public isMacroCategory(category: string): boolean {
        return Object.keys(this.categories ?? {}).includes(category);
    }

    public isProduct(category: string): boolean {
        return this.getMacroCategory(category)?.toLowerCase() === 'products';
    }
}
