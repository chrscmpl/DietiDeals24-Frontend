import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    constructor() {}

    public setOGImage(imageUrl: string): void {
        const meta = document.head.querySelector('[property="og:image"]');
        meta?.setAttribute('content', imageUrl);
    }

    public resetOGImage(): void {
        this.setOGImage(environment.logoUrl);
    }
}
