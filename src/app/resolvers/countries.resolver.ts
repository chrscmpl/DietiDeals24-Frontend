import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { GeographicalLocationsService } from '../services/geographical-locations.service';

@Injectable({
    providedIn: 'root',
})
export class CountriesResolver implements Resolve<Country[]> {
    public constructor(
        private readonly locations: GeographicalLocationsService,
    ) {}

    public resolve(): Observable<Country[]> {
        return this.locations.getCountries();
    }

    public static asResolveFn(): ResolveFn<Country[]> {
        return () => inject(CountriesResolver).resolve();
    }
}
