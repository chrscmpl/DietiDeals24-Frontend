import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AccessoryInformationService {
    constructor(private http: HttpClient) {}

    private trendingCategoriesSubject = new ReplaySubject<string[]>(1);

    public trendingCategories$: Observable<string[]> =
        this.trendingCategoriesSubject.asObservable();

    public refreshTrendingCategories(): void {
        this.http.get<string[]>('dd24-backend/info').subscribe((value) => {
            this.trendingCategoriesSubject.next(value);
        });
    }
}
