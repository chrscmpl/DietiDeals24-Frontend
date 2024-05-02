import { Component, OnInit } from '@angular/core';
import {
    RouteConfigLoadEnd,
    RouteConfigLoadStart,
    Router,
    RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicator } from './helpers/loadingIndicator';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-root',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent, AsyncPipe],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public isLoadingRouteIndicator = new LoadingIndicator(100);

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.router.events.subscribe((ev) => {
            if (ev instanceof RouteConfigLoadStart) {
                this.isLoadingRouteIndicator.start();
            } else if (ev instanceof RouteConfigLoadEnd) {
                this.isLoadingRouteIndicator.stop();
            }
        });
    }
}
