import { Injectable } from '@angular/core';
import {
    ReplaySubject,
    distinctUntilChanged,
    fromEvent,
    map,
    shareReplay,
    startWith,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WindowService {
    constructor() {
        this.UIhiddenSUbject.next(false);
    }

    public isSidebarVisible = false;

    private UIhiddenSUbject = new ReplaySubject<boolean>();

    public UIhidden$ = this.UIhiddenSUbject.asObservable();

    public setUIvisibility(isVisible: boolean) {
        this.UIhiddenSUbject.next(!isVisible);
    }

    public isMobile$ = fromEvent(window, 'resize', { passive: true }).pipe(
        startWith(this.getIsMobile()),
        map(() => this.getIsMobile()),
        distinctUntilChanged(),
        shareReplay(1),
    );

    private getIsMobile() {
        return window.innerWidth <= 768;
    }
}
