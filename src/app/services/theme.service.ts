import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
    Observable,
    ReplaySubject,
    Subject,
    distinctUntilChanged,
    map,
    pipe,
} from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

type theme = 'light' | 'dark';

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
        this.updateThemeLoading();
        this.renderer.setAttribute(
            this.themeLink,
            'href',
            `./theme-${theme}.css`,
        );
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
            console.log('change');
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

    private updateThemeLoading(): void {
        this.themeLoadingSubject.next(true);
        const listener = this.renderer.listen(this.themeLink, 'load', () => {
            this.themeLoadingSubject.next(false);
            this.themeFirstLoadedSubject.next(true);
            listener();
        });
    }
}
