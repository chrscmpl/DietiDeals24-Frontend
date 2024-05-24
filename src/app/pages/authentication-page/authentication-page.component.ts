import { Component } from '@angular/core';
import { AsyncPipe, Location } from '@angular/common';
import { LogoComponent } from '../../components/logo/logo.component';
import { WindowService } from '../../services/window.service';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: 'dd24-authentication-page',
    standalone: true,
    imports: [LogoComponent, AsyncPipe, RouterOutlet],
    templateUrl: './authentication-page.component.html',
    styleUrl: './authentication-page.component.scss',
})
export class AuthenticationPageComponent {
    constructor(
        private readonly location: Location,
        public readonly windowService: WindowService,
    ) {}

    goBack() {
        this.location.back();
    }
}
