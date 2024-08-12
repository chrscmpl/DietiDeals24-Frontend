import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    Step,
    StepperComponent,
} from '../../components/stepper/stepper.component';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, Subscription, take } from 'rxjs';
import { RulesetDescription } from '../../models/ruleset-description.model';
import { AuctionRulesetSelectionComponent } from '../../components/auction-ruleset-selection/auction-ruleset-selection.component';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { ButtonModule } from 'primeng/button';

interface auctionCreationForm {
    ruleset: FormControl<AuctionRuleSet | null>;
}

@Component({
    selector: 'dd24-create-auction-page',
    standalone: true,
    imports: [
        StepperComponent,
        ReactiveFormsModule,
        ButtonModule,
        AuctionRulesetSelectionComponent,
    ],
    templateUrl: './create-auction-page.component.html',
    styleUrl: './create-auction-page.component.scss',
})
export class CreateAuctionPageComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    @ViewChild(StepperComponent) public stepper!: StepperComponent;

    public activeStep: number = 0;

    public form!: FormGroup<auctionCreationForm>;

    public error: string = '';

    public steps: Step[] = [
        {
            title: 'Type',
            nextCallback: this.onNextRuleset.bind(this),
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
            ruleset: this.formBuilder.control<AuctionRuleSet | null>(null, [
                Validators.required,
            ]),
        });

        this.route.data.pipe(take(1)).subscribe((data) => {
            this.rulesets = data['rulesets'];
        });

        this.subscriptions.push(
            this.form.valueChanges.subscribe(() => {
                this.error = '';
            }),
        );

        this.subscriptions.push(
            this.form
                .get('ruleset')!
                .valueChanges.pipe(
                    filter(() => this.form.get('ruleset')?.valid ?? false),
                    take(1),
                )
                .subscribe(this.next.bind(this)),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public next(): void {
        this.stepper.nextStep();
    }

    private onNextRuleset(): boolean {
        if (this.form.get('ruleset')?.valid) return true;
        this.error = 'Please select a ruleset';
        return false;
    }
}
