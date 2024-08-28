import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable, NgZone } from '@angular/core';
import {
    Observable,
    ReplaySubject,
    Subject,
    delay,
    distinctUntilChanged,
    filter,
    fromEvent,
    map,
    merge,
    of,
    shareReplay,
    startWith,
    switchMap,
    throttleTime,
    withLatestFrom,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WindowService {
    private maxHeight = window.innerHeight;
    private styles!: HTMLStyleElement;
    private readonly matchMobile =
        this.mediaMatcher.matchMedia('(max-width: 768px)');
    private resize$ = new Subject<void>();

    constructor(
        private readonly mediaMatcher: MediaMatcher,
        zone: NgZone,
    ) {
        this.UIhiddenSUbject.next(true);
        this.initStyles();

        zone.runOutsideAngular(() => {
            fromEvent(window, 'resize')
                .pipe(throttleTime(500))
                .subscribe(() => {
                    if (window.innerHeight > this.maxHeight)
                        this.maxHeight = window.innerHeight;
                    this.resize$.next();
                });
        });
    }

    public isSidebarVisible = false;

    private UIhiddenSUbject = new ReplaySubject<boolean>();

    public UIhidden$ = this.UIhiddenSUbject.asObservable().pipe(
        distinctUntilChanged(),
    );

    public setUIvisibility(isVisible: boolean): void {
        this.UIhiddenSUbject.next(!isVisible);
    }

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

    public isVirtualKeyboardShown$: Observable<boolean> = merge(
        fromEvent(document.body, 'focus', {
            capture: true,
            passive: true,
        }),
        fromEvent(document.body, 'blur', {
            capture: true,
            passive: true,
        }),
        this.resize$.pipe(map(() => window.innerHeight < this.maxHeight - 100)),
    ).pipe(
        withLatestFrom(this.isMobile$),
        filter(([_, isMobile]) => isMobile),
        map<(boolean | Event)[], boolean>(([e]) =>
            typeof e === 'boolean'
                ? e
                : e.type === 'focus' &&
                  (e?.target as Element)?.matches?.(
                      'input, textarea, select',
                  ) &&
                  !['checkbox', 'radio'].includes(
                      (e?.target as Element)?.getAttribute('type') ?? '',
                  ),
        ),

        distinctUntilChanged(),
        switchMap((isOpen) => of(isOpen).pipe(delay(isOpen ? 0 : 50))),
        shareReplay(1),
    );

    private initStyles(): void {
        this.styles = document.createElement('style');
        this.styles.innerHTML =
            '.dd24-smooth-scroll {scroll-behavior: smooth;}';
        document.head.appendChild(this.styles);
    }
}
