import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CurrencyCodesResolver implements Resolve<string[]> {
    public constructor(private readonly assets: AssetsService) {}

    public resolve(): Observable<string[]> {
        return this.assets.getJsonArray('currency-codes.json');
    }

    public static asResolveFn(): ResolveFn<string[]> {
        return () => inject(CurrencyCodesResolver).resolve();
    }
}
