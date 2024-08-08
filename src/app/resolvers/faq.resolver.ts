import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Observable } from 'rxjs';

interface faq {
    q: string;
    a: string;
}

@Injectable({
    providedIn: 'root',
})
export class FAQResolver implements Resolve<faq[]> {
    public constructor(private readonly assets: AssetsService) {}

    public resolve(): Observable<faq[]> {
        return this.assets.getJsonArray('faq.json');
    }

    public static asResolveFn(): ResolveFn<faq[]> {
        return () => inject(FAQResolver).resolve();
    }
}
