import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInformationCardComponent } from '../../../components/user-information-card/user-information-card.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-activity-page',
    standalone: true,
    imports: [RouterOutlet, UserInformationCardComponent, AsyncPipe],
    templateUrl: './activity-page.component.html',
    styleUrl: './activity-page.component.scss',
})
export class ActivityPageComponent {
    public constructor(public readonly authentication: AuthenticationService) {}
}
