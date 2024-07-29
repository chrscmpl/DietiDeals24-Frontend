import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { ReplaySubject, fromEvent, map, shareReplay, startWith } from 'rxjs';

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
