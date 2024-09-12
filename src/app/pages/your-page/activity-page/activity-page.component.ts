import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserInformationCardComponent } from '../../../components/user-information-card/user-information-card.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'dd24-activity-page',
    standalone: true,
    imports: [
        RouterOutlet,
        UserInformationCardComponent,
        AsyncPipe,
        ButtonModule,
        RouterLink,
    ],
    templateUrl: './activity-page.component.html',
    styleUrl: './activity-page.component.scss',
})
export class ActivityPageComponent {
    public constructor(public readonly authentication: AuthenticationService) {}
}
