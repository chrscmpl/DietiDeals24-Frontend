import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import {
    ReplaySubject,
    distinctUntilChanged,
    filter,
    fromEvent,
    map,
    shareReplay,
    startWith,
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

    private lastHeight = window.innerHeight;

    public isVirtualKeyboardOpenFallback$ = fromEvent(
        window.visualViewport ?? window,
        'resize',
    ).pipe(
        startWith(null),
        throttleTime(100),
        map(() => window.innerHeight),
        filter(
            (height) =>
                height < this.lastHeight - 100 ||
                height > this.lastHeight + 100,
        ),
        map((height) => {
            const ret = height < this.lastHeight;
            this.lastHeight = height;
            return ret;
        }),
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
