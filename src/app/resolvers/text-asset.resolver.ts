import { inject, Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TextAssetResolver {
    public constructor(private readonly assets: AssetsService) {}

    public resolve(filePath: string): Observable<string> {
        return this.assets.getPlainText(filePath);
    }

    public static asResolveFn(filePath: string): ResolveFn<string> {
        return () => inject(TextAssetResolver).resolve(filePath);
    }
}
