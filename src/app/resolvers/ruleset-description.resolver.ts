import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { map, Observable } from 'rxjs';
import { RulesetDescription } from '../models/ruleset-description.model';
import { FAQ } from '../models/faq.model';

@Injectable({
    providedIn: 'root',
})
export class RulesetDescriptionResolver
    implements Resolve<RulesetDescription[]>
{
    public constructor(private readonly assets: AssetsService) {}

    public resolve(): Observable<RulesetDescription[]> {
        return this.assets.getJsonArray('faq.json').pipe(
            map(
                (faqs: FAQ[]) =>
                    faqs
                        .filter((faq) => faq.fragment?.endsWith('auction'))
                        .map((faq) => ({
                            ruleset: faq.fragment!.replace('-auction', ''),
                            description: faq.answer,
                        })) as RulesetDescription[],
            ),
        );
    }

    public static asResolveFn(): ResolveFn<RulesetDescription[]> {
        return () => inject(RulesetDescriptionResolver).resolve();
    }
}
