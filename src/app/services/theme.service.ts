import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
    Observable,
    ReplaySubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    filter,
    fromEvent,
    map,
    shareReplay,
    startWith,
    take,
} from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { isEqual } from 'lodash-es';

export type theme = 'light' | 'dark';

type themeStatus = {
    theme: theme;
    isSystemPreference: boolean;
};

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private themeLink: HTMLLinkElement | null = null;
    private renderer: Renderer2;

    private matchDarkTheme = this.mediaMatcher.matchMedia(
        '(prefers-color-scheme: dark)',
    );

    private systemPreference$: Observable<theme> =
        fromEvent<MediaQueryListEvent>(this.matchDarkTheme, 'change').pipe(
            startWith(this.matchDarkTheme),
            map((mediaQueryListEvent) =>
                mediaQueryListEvent.matches ? 'dark' : 'light',
            ),
            shareReplay(1),
        );

    private manuallySetTheme$: ReplaySubject<theme | null> =
        new ReplaySubject<theme | null>();

    public themeStatus$: Observable<themeStatus> = combineLatest([
        this.systemPreference$,
        this.manuallySetTheme$,
    ]).pipe(
        map(([systemPreference, manuallySetTheme]) => {
            const theme = manuallySetTheme ?? systemPreference;

            return {
                theme,
                isSystemPreference: !manuallySetTheme,
            };
        }),
        debounceTime(100),
        distinctUntilChanged(isEqual),
        shareReplay(1),
    );

    private theme$: Observable<theme> = this.themeStatus$.pipe(
        map((status: themeStatus) => status.theme),
        distinctUntilChanged(isEqual),
        shareReplay(1),
    );

    private _themeLoading$ = new ReplaySubject<boolean>(1);

    public get themeLoading$(): Observable<boolean> {
        return this._themeLoading$;
    }

    constructor(
        private mediaMatcher: MediaMatcher,
        rendererFactory: RendererFactory2,
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);

        let skipFirstLoad = !!document?.head?.querySelector('.theme-link');

        this.manuallySetTheme$.next(this.getSavedThemeFromStorage());

        this.theme$
            .pipe(
                filter(() => {
                    const skip = skipFirstLoad;
                    if (skip) this.onThemeLoad();
                    skipFirstLoad = false;
                    return !skip;
                }),
            )
            .subscribe(this.onThemeChange.bind(this));
    }

    public getSavedThemeFromStorage(): theme | null {
        return localStorage.getItem('theme') as theme | null;
    }

    public saveThemeToStorage(theme: theme | null): void {
        if (theme) localStorage.setItem('theme', theme);
        else localStorage.removeItem('theme');
    }

    public setTheme(theme: theme | 'system'): void {
        const isSystemPreference = theme === 'system';
        this.saveThemeToStorage(isSystemPreference ? null : theme);
        this.manuallySetTheme$.next(isSystemPreference ? null : theme);
    }

    private createStyleSheetLink(): HTMLLinkElement {
        const link = this.renderer.createElement('link');
        this.renderer.setAttribute(link, 'rel', 'stylesheet');
        this.renderer.setAttribute(link, 'type', 'text/css');
        this.renderer.setAttribute(link, 'class', 'theme-link');
        this.renderer.appendChild(document.head, link);
        return link;
    }

    private destroyStyleSheetLink(link: HTMLLinkElement): void {
        this.renderer.removeChild(document.head, link);
    }

    private onThemeChange(theme: theme): void {
        this._themeLoading$.next(true);
        const href = `./theme-${theme}.css`;

        const oldLink = this.themeLink;
        this.themeLink = this.createStyleSheetLink();

        fromEvent(this.themeLink, 'load', { passive: true })
            .pipe(take(1))
            .subscribe(() => {
                if (oldLink) this.destroyStyleSheetLink(oldLink);
                this.onThemeLoad();
            });

        this.renderer.setAttribute(this.themeLink, 'href', href);
    }

    private onThemeLoad(): void {
        this.updateThemeColor();
        this._themeLoading$.next(false);
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
