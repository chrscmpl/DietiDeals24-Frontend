import { Injectable } from '@angular/core';
import { filter, fromEvent, map, shareReplay, startWith, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WindowService {
    constructor() {}

    private lastIsMobileValue: boolean = !this.getIsMobile();

    //rxjs è forte
    public isMobile$ = fromEvent(window, 'resize').pipe(
        startWith(this.getIsMobile()),
        map(() => this.getIsMobile()),
        filter((isMobile) => isMobile !== this.lastIsMobileValue),
        tap((isMobile) => (this.lastIsMobileValue = isMobile)),
        shareReplay(1),
    );

    private getIsMobile() {
        return window.innerWidth <= 768;
    }
}
