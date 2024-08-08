import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Observable } from 'rxjs';
import { FAQ } from '../models/faq.model';

@Injectable({
    providedIn: 'root',
})
export class FAQResolver implements Resolve<FAQ[]> {
    public constructor(private readonly assets: AssetsService) {}

    public resolve(): Observable<FAQ[]> {
        return this.assets.getJsonArray('faq.json');
    }

    public static asResolveFn(): ResolveFn<FAQ[]> {
        return () => inject(FAQResolver).resolve();
    }
}
