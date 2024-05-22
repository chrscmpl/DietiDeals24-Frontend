import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocationsService {
    constructor(private http: HttpClient) {}

    private countriesSubject = new ReplaySubject<string[]>(1);

    public countries$: Observable<string[]> =
        this.countriesSubject.asObservable();

    public refreshCountries(cb?: Partial<Observer<string[]>>): void {
        // this.http
        //     .get<string[]>('dd24-backend/info/countries')
        of(['Italy', 'Germany', 'France', 'Spain', 'United Kingdom'])
            .pipe(
                tap((value) => {
                    this.countriesSubject.next(value);
                }),
            )
            .subscribe(cb);
    }

    public getCities(country: string): Observable<string[]> {
        return this.http.get<string[]>(
            `dd24-backend/info/countries/${country}/cities`,
        );
    }
}
