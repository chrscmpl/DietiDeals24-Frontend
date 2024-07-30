import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WindowService } from '../../services/window.service';
import { LogoComponent } from '../../components/logo/logo.component';
import { AsyncPipe, Location } from '@angular/common';

@Component({
    selector: 'dd24-transactions-page',
    standalone: true,
    imports: [RouterOutlet, AsyncPipe, LogoComponent],
    templateUrl: './transactions-page.component.html',
    styleUrl: './transactions-page.component.scss',
})
export class TransactionsPageComponent {
    public constructor(
        public readonly windowService: WindowService,
        public readonly location: Location,
    ) {}
}
