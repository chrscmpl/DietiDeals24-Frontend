import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Observable } from 'rxjs';
import { RulesetDescription } from '../models/ruleset-description.model';

@Injectable({
    providedIn: 'root',
})
export class RulesetDescriptionResolver
    implements Resolve<RulesetDescription[]>
{
    public constructor(private readonly assets: AssetsService) {}

    public resolve(): Observable<RulesetDescription[]> {
        return this.assets.getJsonArray('rulesets.json');
    }

    public static asResolveFn(): ResolveFn<RulesetDescription[]> {
        return () => inject(RulesetDescriptionResolver).resolve();
    }
}
