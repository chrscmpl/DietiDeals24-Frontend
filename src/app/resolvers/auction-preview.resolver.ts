import { inject, Injectable } from '@angular/core';
import { Resolve, ResolveFn, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Auction } from '../models/auction.model';
import { AuctionCreationData } from '../models/auction-creation-data.model';
import { AuctionStatus } from '../enums/auction-status.enum';
import { AuthenticationService } from '../services/authentication.service';
import { UserSummary } from '../models/user.model';
import { defaults } from 'lodash-es';
import { AuctionDeserializer } from '../deserializers/auction.deserializer';

@Injectable({
    providedIn: 'root',
})
export class AuctionPreviewResolver implements Resolve<Auction> {
    public constructor(
        private readonly router: Router,
        private readonly authentication: AuthenticationService,
        private readonly deserializer: AuctionDeserializer,
    ) {}

    public resolve(): Observable<Auction> {
        const auctionPreviewData: AuctionCreationData =
            this.router.getCurrentNavigation()?.extras?.state?.[
                'auctionPreviewData'
            ];

        if (!auctionPreviewData || !auctionPreviewData.details)
            return throwError(() => new Error('No auction preview data found'));

        const endTime = auctionPreviewData.details.endTime.toISOString();

        const auction = this.deserializer.deserialize(
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
                userId: this.authentication.loggedUser.id,
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
