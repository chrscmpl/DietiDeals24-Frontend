import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
    Observable,
    ReplaySubject,
    Subject,
    distinctUntilChanged,
    fromEvent,
    map,
} from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

export type theme = 'light' | 'dark';

type themeStatus = {
    theme: theme;
    isSystemPreference: boolean;
};

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private themeLink: HTMLLinkElement;
    private renderer: Renderer2;
    private alreadyInitialized: boolean = false;
    private themeLoadingSubject: Subject<boolean> = new ReplaySubject<boolean>(
        1,
    );
    private themeFirstLoadedSubject: Subject<boolean> =
        new ReplaySubject<boolean>(1);

    private isThemeSetManually: boolean = false;
    private preferredColorScheme: theme = 'light';

    private themeSubject: Subject<theme> = new ReplaySubject<theme>(1);
    public theme$: Observable<themeStatus> = this.themeSubject
        .asObservable()
        .pipe(
            map((theme: theme) => ({
                theme,
                isSystemPreference: !this.isThemeSetManually,
            })),
        );

    constructor(
        private mediaMatcher: MediaMatcher,
        rendererFactory: RendererFactory2,
    ) {
        this.themeLoadingSubject.next(false);
        this.themeFirstLoadedSubject.next(false);
        this.renderer = rendererFactory.createRenderer(null, null);
        this.themeLink = this.renderer.createElement('link');
        this.renderer.setAttribute(this.themeLink, 'rel', 'stylesheet');
        this.renderer.setAttribute(this.themeLink, 'type', 'text/css');

        fromEvent(this.themeLink, 'load', { passive: true }).subscribe(() => {
            this.themeLoadingSubject.next(false);
            this.themeFirstLoadedSubject.next(true);
            this.updateThemeColor();
        });

        this.listenForPreferredColorScheme();
    }

    public themeLoading$: Observable<boolean> =
        this.themeLoadingSubject.asObservable();

    public themeFirstLoaded$: Observable<boolean> = this.themeFirstLoadedSubject
        .asObservable()
        .pipe(distinctUntilChanged());

    public initTheme(): void {
        let theme: string | null = localStorage.getItem('theme');
        if (theme) {
            this.isThemeSetManually = true;
        } else {
            theme = this.preferredColorScheme;
        }
        this.setThemeWithoutSaving(theme as theme);
    }

    public setTheme(theme: theme | 'system'): void {
        if (theme === 'system') {
            this.setThemeToSystemPreference();
            return;
        }
        localStorage.setItem('theme', theme);
        this.isThemeSetManually = true;
        this.setThemeWithoutSaving(theme);
    }

    private setThemeToSystemPreference(): void {
        localStorage.removeItem('theme');
        this.isThemeSetManually = false;
        this.setThemeWithoutSaving(this.preferredColorScheme);
    }

    private setThemeWithoutSaving(theme: theme): void {
        const href = `./theme-${theme}.css`;
        if (href === this.themeLink.getAttribute('href')) return;

        this.themeLoadingSubject.next(true);
        this.renderer.setAttribute(this.themeLink, 'href', href);
        if (!this.alreadyInitialized) {
            this.renderer.appendChild(document.head, this.themeLink);
            this.alreadyInitialized = true;
        }
        this.themeSubject.next(theme);
    }

    private listenForPreferredColorScheme(): void {
        const prefersDark = this.mediaMatcher.matchMedia(
            '(prefers-color-scheme: dark)',
        );
        this.preferredColorScheme = prefersDark.matches ? 'dark' : 'light';

        prefersDark.addEventListener('change', (mediaQueryListEvent) => {
            const newTheme = mediaQueryListEvent.matches ? 'dark' : 'light';
            if (
                this.preferredColorScheme !== newTheme &&
                !this.isThemeSetManually
            ) {
                this.preferredColorScheme = newTheme;
                this.setThemeWithoutSaving(newTheme);
            }
        });
    }

    private updateThemeColor(): void {
        const themeColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--component-color');

        if (themeColor)
            document.head
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', themeColor);
    }
}
