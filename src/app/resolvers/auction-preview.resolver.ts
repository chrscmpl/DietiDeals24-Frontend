import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Auction } from '../models/auction.model';
import { auctionBuilder } from '../helpers/builders/auction-builder';
import { AuctionCreationData } from '../models/auction-creation-data.model';
import { AuctionStatus } from '../enums/auction-status.enum';
import { AuthenticationService } from '../services/authentication.service';
import { UserSummary } from '../models/user.model';
import { defaults } from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class AuctionPreviewResolver implements Resolve<Auction> {
    public constructor(
        private readonly router: Router,
        private readonly authentication: AuthenticationService,
    ) {}

    public resolve(): Observable<Auction> {
        const auctionPreviewData: AuctionCreationData =
            this.router.getCurrentNavigation()?.extras?.state?.[
                'auctionPreviewData'
            ];

        if (!auctionPreviewData || !auctionPreviewData.details)
            return throwError(() => new Error('No auction preview data found'));

        const endTime = auctionPreviewData.details.endTime.toISOString();

        const auction = auctionBuilder.buildSingle(
            defaults(
                { endTime },
                {
                    ...auctionPreviewData.details,
                    id: '',
                    userId: this.authentication.loggedUser?.id ?? '',
                    type: auctionPreviewData.ruleset,
                    category: auctionPreviewData.category,
                    status: AuctionStatus.active,
                    picturesUrls: auctionPreviewData.pictures.map((p) =>
                        URL.createObjectURL(p.file),
                    ),
                },
            ),
        );

        if (this.authentication.loggedUser)
            auction.user = new UserSummary({
                id: this.authentication.loggedUser.id,
                username: this.authentication.loggedUser.username,
                profilePictureUrl:
                    this.authentication.loggedUser.profilePictureUrl ?? '',
                country: this.authentication.loggedUser.country ?? '',
                city: this.authentication.loggedUser.city ?? '',
            });

        return of(auction);
    }

    public static asResolveFn(): ResolveFn<Auction> {
        return () => inject(AuctionPreviewResolver).resolve();
    }
}
