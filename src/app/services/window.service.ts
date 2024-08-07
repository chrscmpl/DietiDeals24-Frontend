import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import {
    Observable,
    ReplaySubject,
    delay,
    distinctUntilChanged,
    fromEvent,
    map,
    merge,
    of,
    shareReplay,
    startWith,
    switchMap,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WindowService {
    private styles!: HTMLStyleElement;
    private readonly matchMobile =
        this.mediaMatcher.matchMedia('(max-width: 768px)');

    constructor(private readonly mediaMatcher: MediaMatcher) {
        this.UIhiddenSUbject.next(true);
        this.initStyles();
    }

    public isSidebarVisible = false;

    private UIhiddenSUbject = new ReplaySubject<boolean>();

    public UIhidden$ = this.UIhiddenSUbject.asObservable();

    public setUIvisibility(isVisible: boolean): void {
        this.UIhiddenSUbject.next(!isVisible);
    }

    public setSmoothScrolling(value: boolean): void {
        if (value) document.documentElement.classList.add('dd24-smooth-scroll');
        else document.documentElement.classList.remove('dd24-smooth-scroll');
    }

    public isMobile$: Observable<boolean> = fromEvent<MediaQueryListEvent>(
        this.matchMobile,
        'change',
    ).pipe(
        map((e) => e.matches),
        startWith(this.matchMobile.matches),
        shareReplay(1),
    );

    public isVirtualKeyboardOpenFallback$: Observable<boolean> = merge(
        fromEvent(document.body, 'focus', { capture: true, passive: true }),
        fromEvent(document.body, 'blur', { capture: true, passive: true }),
    ).pipe(
        map(
            (e) =>
                e.type === 'focus' &&
                (e?.target as Element)?.matches?.('input, textarea, select'),
        ),
        distinctUntilChanged(),
        switchMap((isOpen) => of(isOpen).pipe(delay(isOpen ? 0 : 50))),
        shareReplay(1),
    );

    public confirmReload(value: boolean): void {
        if (value) {
            window.onbeforeunload = (e) => {
                const confirmMessage = 'Are you sure you want to leave?';
                e.returnValue = confirmMessage;
                return confirmMessage;
            };
        } else {
            if (window.onbeforeunload !== null) window.onbeforeunload = null;
        }
    }

    private initStyles(): void {
        this.styles = document.createElement('style');
        this.styles.innerHTML =
            '.dd24-smooth-scroll {scroll-behavior: smooth;}';
        document.head.appendChild(this.styles);
    }
}
