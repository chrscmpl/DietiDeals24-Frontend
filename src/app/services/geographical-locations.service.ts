import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';

import { Country } from '../models/location.model';
import { CountryDTO } from '../DTOs/country.dto';
import { environment } from '../../environments/environment';
import { Cacheable } from 'ts-cacheable';
import { CountryDeserializer } from '../deserializers/country.deserializer';

@Injectable({
    providedIn: 'root',
})
export class GeographicalLocationsService {
    constructor(
        private readonly http: HttpClient,
        private readonly deserializer: CountryDeserializer,
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
        this.getCountries().subscribe(cb);
    }

    @Cacheable()
    private getCountries(): Observable<Country[]> {
        return this.http
            .get<CountryDTO[]>(`${environment.backendHost}/countries`)
            .pipe(
                map((dtos: CountryDTO[]) =>
                    this.deserializer.deserializeArray(dtos),
                ),
                tap((countries) => {
                    this._countries = countries;
                    this.countriesSubject.next();
                }),
            );
    }

    @Cacheable({
        maxCacheCount: 4,
    })
    public getCities(country: Country | string): Observable<string[]> {
        return this.http.get<string[]>(`${environment.backendHost}/cities`, {
            params: {
                country: typeof country === 'string' ? country : country.code,
            },
        });
    }
}
