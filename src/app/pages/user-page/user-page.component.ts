import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { take } from 'rxjs';
import { UserInformationCardComponent } from '../../components/user-information-card/user-information-card.component';

@Component({
    selector: 'dd24-user-page',
    standalone: true,
    imports: [UserInformationCardComponent, RouterOutlet],
    templateUrl: './user-page.component.html',
    styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit {
    public user!: User;

    public constructor(private readonly route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.user = data['user'];
        });
    }
}
