import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';

import { Country } from '../models/location.model';
import { CountryDTO } from '../DTOs/country.dto';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LocationsService {
    constructor(private readonly http: HttpClient) {}

    private countriesSubject = new ReplaySubject<void>(1);
    private _countries: Country[] | null = null;

    public get countries(): Country[] | null {
        return this._countries;
    }

    public countries$: Observable<Country[]> = this.countriesSubject
        .asObservable()
        .pipe(map(() => this._countries ?? []));

    public refreshCountries(cb?: Partial<Observer<Country[]>>): void {
        this.http
            .get<CountryDTO[]>(`${environment.backendHost}/countries`)
            .pipe(
                tap((countries) => {
                    this._countries = countries;
                    this.countriesSubject.next();
                }),
            )
            .subscribe(cb);
    }

    public getCities(country: Country | string): Observable<string[]> {
        return this.http.get<string[]>(`${environment.backendHost}/cities`, {
            params: {
                country: typeof country === 'string' ? country : country.code,
            },
        });
    }
}
