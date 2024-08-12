import { Component, OnInit } from '@angular/core';
import {
    Step,
    StepperComponent,
} from '../../components/stepper/stepper.component';
import {
    Form,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { RulesetDescription } from '../../models/ruleset-description.model';
import { AuctionRulesetSelectionComponent } from '../../components/auction-ruleset-selection/auction-ruleset-selection.component';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';

interface auctionCreationForm {
    ruleset: FormControl<AuctionRuleSet | null>;
}

@Component({
    selector: 'dd24-create-auction-page',
    standalone: true,
    imports: [
        StepperComponent,
        ReactiveFormsModule,
        AuctionRulesetSelectionComponent,
    ],
    templateUrl: './create-auction-page.component.html',
    styleUrl: './create-auction-page.component.scss',
})
export class CreateAuctionPageComponent implements OnInit {
    public activeStep: number = 0;

    public form!: FormGroup<auctionCreationForm>;

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

    public rulesets: RulesetDescription[] = [];

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            ruleset: this.formBuilder.control<AuctionRuleSet | null>(null),
        });
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.rulesets = data['rulesets'];
        });
    }
}
