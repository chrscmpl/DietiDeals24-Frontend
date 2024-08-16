import { Component, ElementRef, Input, NgZone } from '@angular/core';
import { RulesetDescription } from '../../models/ruleset-description.model';
import { MenuItem } from 'primeng/api';
import { auctionRuleSetsByKind } from '../../helpers/auction-rulesets-by-kind';
import { AuctionKind } from '../../enums/auction-kind.enum';
import { utils } from '../../helpers/utils';
import { ReactiveFormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadioToggleButtonComponent } from '../radio-toggle-button/radio-toggle-button.component';
import { DividerModule } from 'primeng/divider';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';

@Component({
    selector: 'dd24-auction-creation-ruleset-selection',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgTemplateOutlet,
        PanelMenuModule,
        RadioToggleButtonComponent,
        DividerModule,
        OneCharUpperPipe,
        RadioToggleButtonComponent,
    ],
    templateUrl: './auction-creation-ruleset-selection.component.html',
    styleUrl: './auction-creation-ruleset-selection.component.scss',
})
export class AuctionCreationRulesetSelectionComponent {
    @Input({ required: true }) public controlName!: string;
    @Input({ required: true }) public set rulesets(
        value: RulesetDescription[],
    ) {
        this.initRulesetsMenuItems(value);
        this.removeEventListenersFromTopMenuItems();
    }

    public sellRulesetsMenuItems: MenuItem[] = [];

    public buyRulesetsMenuItems: MenuItem[] = [];

    public constructor(
        private readonly zone: NgZone,
        private readonly element: ElementRef,
    ) {}

    private initRulesetsMenuItems(rulesets: RulesetDescription[]): void {
        const { success: sellRulesets, failure: buyRulesets } =
            utils.splitArray<RulesetDescription>(
                rulesets,
                (rs) =>
                    auctionRuleSetsByKind
                        .get(AuctionKind.selling)
                        ?.includes(rs.ruleset) ?? false,
            );
        this.sellRulesetsMenuItems = this.rulesetsToMenuItems(
            '"I want to sell"',
            'sell-menu',
            sellRulesets,
        );
        this.buyRulesetsMenuItems = this.rulesetsToMenuItems(
            '"I want to buy"',
            'buy-menu',
            buyRulesets,
        );
    }

    private rulesetsToMenuItems(
        label: string,
        id: string,
        rulesets: RulesetDescription[],
    ): MenuItem[] {
        return [
            {
                label,
                id,
                expanded: true,
                items: rulesets.map((rs) => ({
                    label: rs.ruleset,
                    id: `${rs.ruleset}-auction-menu-option`,
                    items: [
                        {
                            label: rs.description,
                        },
                    ],
                })),
            },
        ];
    }

    private removeEventListenersFromTopMenuItems(): void {
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                if (!this) return;
                const topMenuItems: HTMLElement[] =
                    this.element.nativeElement.querySelectorAll(
                        '#sell-menu_header, #buy-menu_header',
                    );
                topMenuItems.forEach((item) => {
                    item.parentElement?.replaceChild(
                        item.cloneNode(true),
                        item,
                    );
                });
            }, 50);
        });
    }
}
