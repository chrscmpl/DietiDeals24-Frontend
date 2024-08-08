import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dd24-auction-ruleset-link',
    standalone: true,
    imports: [UpperCasePipe, RouterLink],
    templateUrl: './auction-ruleset-link.component.html',
    styleUrl: './auction-ruleset-link.component.scss',
})
export class AuctionRuleSetLinkComponent {
    @Input({ required: true })
    ruleSet!: AuctionRuleSet;

    constructor() {}

    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
