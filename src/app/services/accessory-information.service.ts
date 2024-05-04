import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AccessoryInformationService {
    private _trendingCategories: string[] | null = //= null;
        [
            'Smartphones',
            'Laptops',
            'Tablets',
            'Smartwatches',
            'Headphones',
            'Videogames and consoles',
        ];

    constructor(private http: HttpClient) {}

    public getTrendingCategories(): Observable<string[]> {
        return this._trendingCategories !== null
            ? of<string[]>(this._trendingCategories)
            : this.http.get<string[]>('dd24-backend/info').pipe(
                  tap((categories: string[]) => {
                      this._trendingCategories = categories;
                  }),
              );
    }
}
