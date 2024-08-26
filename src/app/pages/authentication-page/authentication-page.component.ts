import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../../components/logo/logo.component';
import { WindowService } from '../../services/window.service';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
@Component({
    selector: 'dd24-authentication-page',
    standalone: true,
    imports: [LogoComponent, AsyncPipe, RouterOutlet],
    templateUrl: './authentication-page.component.html',
    styleUrl: './authentication-page.component.scss',
})
export class AuthenticationPageComponent {
    constructor(
        private readonly navigation: NavigationService,
        public readonly windowService: WindowService,
    ) {}

    goBack() {
        this.navigation.back();
    }
}
