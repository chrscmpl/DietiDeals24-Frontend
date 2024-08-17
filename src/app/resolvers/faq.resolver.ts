import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { map, Observable, withLatestFrom } from 'rxjs';
import { FAQ } from '../models/faq.model';
import { RulesetDescription } from '../models/ruleset-description.model';

@Injectable({
    providedIn: 'root',
})
export class FAQResolver implements Resolve<FAQ[]> {
    public constructor(private readonly assets: AssetsService) {}

    public resolve(): Observable<FAQ[]> {
        return this.assets.getJsonArray('faq.json').pipe(
            withLatestFrom(
                this.assets.getJsonArray('rulesets.json').pipe(
                    map((rulesets: RulesetDescription[]) =>
                        rulesets.map((rs) => ({
                            question: `What is a ${rs.ruleset} auction?`,
                            answer: rs.description,
                            fragment: `${rs.ruleset}-auction`,
                        })),
                    ),
                ),
            ),
            map(([faqs, rulesetFaqs]) => {
                let insertIndex = faqs.findIndex((faq) => faq.insertRulesets);
                if (insertIndex === -1) insertIndex = faqs.length;
                faqs.splice(insertIndex, 0, ...rulesetFaqs);
                return faqs;
            }),
        );
    }

    public static asResolveFn(): ResolveFn<FAQ[]> {
        return () => inject(FAQResolver).resolve();
    }
}
