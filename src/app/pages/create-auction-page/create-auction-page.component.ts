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
import { AuctionCreationRulesetSelectionComponent } from '../../components/auction-creation-ruleset-selection/auction-creation-ruleset-selection.component';
import { AuctionRuleSet } from '../../enums/auction-ruleset.enum';
import { ButtonModule } from 'primeng/button';
import { AuctionCreationCategorySelectionComponent } from '../../components/auction-creation-category-selection/auction-creation-category-selection.component';

interface auctionCreationForm {
    ruleset: FormControl<AuctionRuleSet | null>;
    category: FormControl<string | null>;
}

@Component({
    selector: 'dd24-create-auction-page',
    standalone: true,
    imports: [
        StepperComponent,
        ReactiveFormsModule,
        ButtonModule,
        AuctionCreationRulesetSelectionComponent,
        AuctionCreationCategorySelectionComponent,
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
            nextCallback: () =>
                this.checkNext(
                    this.form.controls.ruleset,
                    'Please select a ruleset',
                ),
        },
        {
            title: 'Category',
            nextCallback: () => {
                this.automaticNextCategory = false;
                return this.checkNext(
                    this.form.controls.category,
                    'Please select a valid category',
                );
            },
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

    private automaticNextCategory: boolean = true;

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            ruleset: this.formBuilder.control<AuctionRuleSet | null>(null, [
                Validators.required,
            ]),
            category: this.formBuilder.control<string | null>(null, [
                Validators.required,
            ]),
        });

        this.route.data.pipe(take(1)).subscribe((data) => {
            this.rulesets = data['rulesets'];
        });

        this.subscriptions.push(
            this.form.valueChanges.subscribe(() => {
                if (this.error) this.error = '';
            }),
        );

        this.onFirstChange(this.form.controls.ruleset, this.next.bind(this));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public next(): void {
        this.stepper.nextStep();
    }

    private checkNext(control: FormControl, error: string): boolean {
        if (control.valid) return true;
        control.markAsDirty();
        this.error = error;
        return false;
    }

    private onFirstChange(control: FormControl, cb: () => unknown): void {
        this.subscriptions.push(
            control.valueChanges
                .pipe(
                    filter(() => control.valid),
                    take(1),
                )
                .subscribe(cb),
        );
    }

    public onCategorySelected(): void {
        if (this.automaticNextCategory) {
            this.automaticNextCategory = false;
            this.next();
        }
    }
}
