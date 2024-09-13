import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import { Country } from '../models/country.model';
import { CountryDTO } from '../DTOs/country.dto';

@Injectable({
    providedIn: 'root',
})
export class CountryDeserializer implements Deserializer<CountryDTO, Country> {
    public deserialize(dto: CountryDTO): Country {
        return dto;
    }

    public deserializeArray(dtos: CountryDTO[]): Country[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
