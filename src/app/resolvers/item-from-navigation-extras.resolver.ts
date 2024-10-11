/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';

interface Options {
    key: string;
    required: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ItemFromNavigationExtrasResolver {
    public constructor(private readonly router: Router) {}

    public resolve(options: Options): any {
        const item =
            this.router.getCurrentNavigation()?.extras.state?.[options.key];
        if (!item && options.required)
            throw new Error(`item ${options.key} not found`);
        return item;
    }

    public static asResolveFn(options: Options): ResolveFn<any> {
        return () => inject(ItemFromNavigationExtrasResolver).resolve(options);
    }
}
