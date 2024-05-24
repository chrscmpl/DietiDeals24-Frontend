import { Component } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { AsyncPipe, Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dd24-mobile-header',
    standalone: true,
    imports: [AsyncPipe, RouterLink],
    templateUrl: './mobile-header.component.html',
    styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent {
    constructor(
        public windowService: WindowService,
        public location: Location,
    ) {}
}
