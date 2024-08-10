import { Component, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { AsyncPipe, Location } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LogoComponent } from '../logo/logo.component';
import { NavigationService } from '../../services/navigation.service';
import { delay, map, Observable, shareReplay, startWith, tap } from 'rxjs';

@Component({
    selector: 'dd24-mobile-header',
    standalone: true,
    imports: [AsyncPipe, RouterLink, RouterLinkActive, LogoComponent],
    templateUrl: './mobile-header.component.html',
    styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent {
    public title$: Observable<string> =
        this.navigationService.navigationEnd$.pipe(
            startWith(null),
            delay(50),
            map(() => this.titleService.getTitle()),
            tap(this.adjustTitleSize.bind(this)),
            shareReplay(1),
        );

    constructor(
        public readonly windowService: WindowService,
        public readonly location: Location,
        public readonly titleService: Title,
        private readonly navigationService: NavigationService,
        private readonly element: ElementRef,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone,
    ) {}

    private adjustTitleSize() {
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                const title =
                    this.element.nativeElement.querySelector('.title');
                if (!title) return;
                if (title.clientHeight < title.scrollHeight)
                    this.renderer.addClass(title, 'title-long');
                else this.renderer.removeClass(title, 'title-long');
            }, 50);
        });
    }
}
