import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, of, tap } from 'rxjs';

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

    public categories$: Observable<Categories> =
        this.categoriesSubject.asObservable();

    public refreshCategories(cb?: Partial<Observer<Categories>>): void {
        // this.http
        //     .get<Categories>('dd24-backend/info/categories')
        of({
            products: [
                'phones',
                'laptops',
                'tablets',
                'smartwatches',
                'headphones',
                'speakers',
                'cameras',
                'drones',
                'gaming',
                'accessories',
                'home appliances',
                'smart home',
                'wearables',
                'car accessories',
                'office supplies',
                'software',
                'books',
                'movies',
                'music',
                'games',
                'toys',
                'clothes',
            ],
            services: [
                'video editing',
                'photo editing',
                'audio editing',
                'graphic design',
                'web design',
                'web development',
                'app development',
                'game development',
                '3d modeling',
                'animation',
                'writing',
                'translation',
                'transcription',
                'proofreading',
                'copywriting',
                'content writing',
                'blog writing',
                'article writing',
                'resume writing',
                'cover letter writing',
                'business writing',
                'technical writing',
                'creative writing',
                'academic writing',
                'research writing',
            ],
        } as Categories)
            .pipe(
                map((categories) => ({
                    products: categories.products.sort(),
                    services: categories.services.sort(),
                })),
                tap((value) => {
                    this.categoriesSubject.next(value);
                }),
            )
            .subscribe(cb);
    }
}
