import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocationsService {
    constructor(private http: HttpClient) {}

    private countriesSubject = new ReplaySubject<void>(1);
    private _countries: string[] = [];

    public get countries(): string[] {
        return this._countries;
    }

    public countries$: Observable<string[]> = this.countriesSubject
        .asObservable()
        .pipe(map(() => this._countries));

    public refreshCountries(cb?: Partial<Observer<string[]>>): void {
        // this.http
        //     .get<string[]>('dd24-backend/info/countries')
        of(['Italy', 'Germany', 'France', 'Spain', 'United Kingdom'])
            .pipe(
                tap((value) => {
                    this._countries = value;
                    this.countriesSubject.next();
                }),
            )
            .subscribe(cb);
    }

    public getCities(country: string): Observable<string[]> {
        // return this.http.get<string[]>(
        //     `dd24-backend/info/countries/${country}/cities`,
        // );
        return of(['Rome', 'Milan', 'Naples', 'Turin', 'Palermo']);
    }
}
