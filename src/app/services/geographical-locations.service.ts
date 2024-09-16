import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, map, tap } from 'rxjs';

import { Country } from '../models/country.model';
import { CountryDTO } from '../DTOs/country.dto';
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

    @Cacheable()
    public getCountries(): Observable<Country[]> {
        return this.http
            .get<CountryDTO[]>(`countries`)
            .pipe(
                map((dtos: CountryDTO[]) =>
                    this.deserializer.deserializeArray(dtos),
                ),
            );
    }

    @Cacheable({
        maxCacheCount: 4,
    })
    public getCities(country: Country | string): Observable<string[]> {
        return this.http.get<string[]>(`cities`, {
            params: {
                country: typeof country === 'string' ? country : country.code,
            },
        });
    }
}
