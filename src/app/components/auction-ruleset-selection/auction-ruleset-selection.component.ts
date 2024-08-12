import { Component, Input } from '@angular/core';
import { RulesetDescription } from '../../models/ruleset-description.model';
import { MenuItem } from 'primeng/api';
import { auctionRuleSetsByKind } from '../../helpers/auction-rulesets-by-kind';
import { AuctionKind } from '../../enums/auction-kind.enum';
import { utils } from '../../helpers/utils';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadioToggleButtonComponent } from '../radio-toggle-button/radio-toggle-button.component';
import { DividerModule } from 'primeng/divider';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';

@Component({
    selector: 'dd24-auction-ruleset-selection',
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
    templateUrl: './auction-ruleset-selection.component.html',
    styleUrl: './auction-ruleset-selection.component.scss',
})
export class AuctionRulesetSelectionComponent {
    @Input({ required: true }) public form!: FormGroup;
    @Input({ required: true }) public controlName!: string;

    @Input({ required: true }) public set rulesets(
        value: RulesetDescription[],
    ) {
        this.initRulesetsMenuItems(value);
    }

    public sellRulesetsMenuItems: MenuItem[] = [];

    public buyRulesetsMenuItems: MenuItem[] = [];

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
}
