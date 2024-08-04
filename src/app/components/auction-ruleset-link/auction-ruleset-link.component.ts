import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { Router } from '@angular/router';

@Component({
    selector: 'dd24-auction-ruleset-link',
    standalone: true,
    imports: [UpperCasePipe],
    templateUrl: './auction-ruleset-link.component.html',
    styleUrl: './auction-ruleset-link.component.scss',
})
export class AuctionRuleSetLinkComponent {
    @Input({ required: true })
    ruleSet!: AuctionRuleSet;

    constructor(private readonly router: Router) {}

    public async onNavigate(): Promise<void> {
        await this.router.navigate(['/help'], {
            fragment: `${this.ruleSet}-auctions`,
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
