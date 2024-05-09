import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

type theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private themeLink: HTMLLinkElement;
    private renderer: Renderer2;
    private linkAdded: boolean = false;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.themeLink = this.renderer.createElement('link');
        this.renderer.setAttribute(this.themeLink, 'rel', 'stylesheet');
        this.renderer.setAttribute(this.themeLink, 'type', 'text/css');
    }

    public setTheme(theme: theme): void {
        this.renderer.setAttribute(
            this.themeLink,
            'href',
            `./theme-${theme}.css`,
        );
        if (!this.linkAdded) {
            this.renderer.appendChild(document.head, this.themeLink);
            this.linkAdded = true;
        }
    }
}
