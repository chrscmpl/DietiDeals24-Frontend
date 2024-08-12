import { Component, OnInit } from '@angular/core';
import { RadioToggleButtonComponent } from '../../components/radio-toggle-button/radio-toggle-button.component';
import {
    Step,
    StepperComponent,
} from '../../components/stepper/stepper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { utils } from '../../helpers/utils';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { auctionRuleSetsByKind } from '../../helpers/auction-rulesets-by-kind';
import { AuctionKind } from '../../enums/auction-kind.enum';
import { RulesetDescription } from '../../models/ruleset-description.model';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'dd24-create-auction-page',
    standalone: true,
    imports: [
        StepperComponent,
        ReactiveFormsModule,
        NgTemplateOutlet,
        PanelMenuModule,
        RadioToggleButtonComponent,
    ],
    templateUrl: './create-auction-page.component.html',
    styleUrl: './create-auction-page.component.scss',
})
export class CreateAuctionPageComponent implements OnInit {
    public activeStep: number = 0;

    public steps: Step[] = [
        {
            title: 'Type',
        },
        {
            title: 'Category',
        },
        {
            title: 'Details',
        },
        {
            title: 'Pictures',
        },
        {
            title: 'Review',
        },
    ];

    public sellRulesetsMenuItems: MenuItem[] = [];

    public buyRulesetsMenuItems: MenuItem[] = [];

    public constructor(private readonly route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.initRulesetsMenuItems(data['rulesets']);
        });
    }

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
            'I want to sell',
            sellRulesets,
        );
        this.buyRulesetsMenuItems = this.rulesetsToMenuItems(
            'I want to buy',
            buyRulesets,
        );
    }

    private rulesetsToMenuItems(
        label: string,
        rulesets: RulesetDescription[],
    ): MenuItem[] {
        return [
            {
                label,
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
