import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import {
    Observable,
    ReplaySubject,
    distinctUntilChanged,
    filter,
    fromEvent,
    map,
    merge,
    shareReplay,
    startWith,
    tap,
    throttleTime,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WindowService {
    private readonly matchMobile =
        this.mediaMatcher.matchMedia('(max-width: 768px)');

    constructor(private readonly mediaMatcher: MediaMatcher) {
        this.UIhiddenSUbject.next(false);
    }

    public isSidebarVisible = false;

    private UIhiddenSUbject = new ReplaySubject<boolean>();

    public UIhidden$ = this.UIhiddenSUbject.asObservable();

    public setUIvisibility(isVisible: boolean) {
        this.UIhiddenSUbject.next(!isVisible);
    }

    public isMobile$ = fromEvent<MediaQueryListEvent>(
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
        filter<Event>((e) =>
            (e?.target as Element)?.matches?.('input, textarea, select'),
        ),
        map((e) => e.type === 'focus'),
        distinctUntilChanged(),
        shareReplay(1),
    );

    public confirmReload(value: boolean) {
        if (value) {
            window.onbeforeunload = (e) => {
                const confirmMessage = 'Are you sure you want to leave?';
                e.returnValue = confirmMessage;
                return confirmMessage;
            };
        } else {
            window.onbeforeunload = null;
        }
    }
}
