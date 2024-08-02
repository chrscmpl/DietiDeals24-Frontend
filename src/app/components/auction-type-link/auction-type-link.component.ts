import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AuctionType } from '../../enums/auctionType.enum';
import { Router } from '@angular/router';

@Component({
    selector: 'dd24-auction-type-link',
    standalone: true,
    imports: [UpperCasePipe],
    templateUrl: './auction-type-link.component.html',
    styleUrl: './auction-type-link.component.scss',
})
export class AuctionTypeLinkComponent {
    @Input({ required: true })
    type!: AuctionType;

    constructor(private readonly router: Router) {}

    public async onNavigate(): Promise<void> {
        await this.router.navigate(['/help'], {
            fragment: `${this.type}-auctions`,
            skipLocationChange: true,
        });
        this.router.navigate([{ outlets: { overlay: null } }]);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onNavigate();
        }
    }
}
