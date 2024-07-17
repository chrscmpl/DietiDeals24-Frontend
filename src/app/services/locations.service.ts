import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { Country } from '../models/location.model';
import { CountryDTO } from '../DTOs/country.dto';

@Injectable({
    providedIn: 'root',
})
export class LocationsService {
    constructor(
        private readonly http: HttpClient,
        private readonly env: EnvironmentService,
    ) {}

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
            .get<CountryDTO[]>(`${this.env.server}/countries`)
            .pipe(
                tap((countries) => {
                    this._countries = countries;
                    this.countriesSubject.next();
                }),
            )
            .subscribe(cb);
    }

    public getCities(country: Country | string): Observable<string[]> {
        return this.http.get<string[]>(`${this.env.server}/cities`, {
            params: {
                country: typeof country === 'string' ? country : country.code,
            },
        });
    }
}
