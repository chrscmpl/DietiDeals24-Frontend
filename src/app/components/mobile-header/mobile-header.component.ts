import { Component } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { AsyncPipe, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LogoComponent } from '../logo/logo.component';
import { NavigationService } from '../../services/navigation.service';
import { delay, map, Observable, shareReplay, startWith, tap } from 'rxjs';

@Component({
    selector: 'dd24-mobile-header',
    standalone: true,
    imports: [AsyncPipe, RouterLink, LogoComponent],
    templateUrl: './mobile-header.component.html',
    styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent {
    public longTitle: boolean = false;

    public title$: Observable<string> =
        this.navigationService.navigationEnd$.pipe(
            startWith(null),
            delay(50),
            map(() => this.titleService.getTitle()),
            tap((title) => (this.longTitle = title.length > 18)),
            shareReplay(1),
        );

    constructor(
        public readonly windowService: WindowService,
        public readonly location: Location,
        public readonly titleService: Title,
        private readonly navigationService: NavigationService,
    ) {}
}
