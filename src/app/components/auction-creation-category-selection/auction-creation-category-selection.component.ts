import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    ControlContainer,
    FormControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { InputTextModule } from 'primeng/inputtext';
import { RadioToggleButtonComponent } from '../radio-toggle-button/radio-toggle-button.component';
import { debounceTime, filter } from 'rxjs';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';

@Component({
    selector: 'dd24-auction-creation-category-selection',
    standalone: true,
    imports: [
        InputTextModule,
        RadioToggleButtonComponent,
        ReactiveFormsModule,
        OneCharUpperPipe,
    ],
    templateUrl: './auction-creation-category-selection.component.html',
    styleUrl: './auction-creation-category-selection.component.scss',
})
export class AuctionCreationCategorySelectionComponent implements OnInit {
    @Input({ required: true }) public controlName!: string;

    @Output() public selected = new EventEmitter<void>();

    private control!: FormControl;

    public filterControl: FormControl = new FormControl<string>('');

    public interacted: boolean = false;

    private categories: { value: string; index: number }[] = [];
    public filteredCategories: { value: string; index: number }[] = [];
    public macroCategories: string[] = [];

    public placeholder: string = '';

    public constructor(
        private readonly controlContainer: ControlContainer,
        private readonly categoriesService: CategoriesService,
    ) {}

    public ngOnInit(): void {
        this.setControl();

        this.categoriesService.categories$.subscribe((categories) => {
            this.macroCategories = Object.keys(categories);
            this.categories = Object.values(categories)
                .flat()
                .map((value, index) => ({ value, index }));

            this.placeholder = this.categories
                .slice(0, 3)
                .map((category) => category.value)
                .join(', ')
                .toLowerCase();

            if (this.control.value) {
                this.filterControl.setValue(this.control.value);
                this.interacted = true;
                this.filterCategories(this.control.value);
            }
        });

        this.filterControl.valueChanges
            .pipe(
                debounceTime(500),
                filter((value) => value.length > 1),
            )
            .subscribe(this.onFilter.bind(this));
    }

    public onInputBlur() {
        if (!this.filterControl.value) return;
        const categoriesOptions = this.categories
            .map((val) => val.value)
            .concat(this.macroCategories);
        const categoryIndex = categoriesOptions.findIndex(
            (category) =>
                category.toLowerCase() ===
                this.filterControl.value.toLowerCase(),
        );
        if (categoryIndex !== -1)
            this.control.setValue(categoriesOptions[categoryIndex]);
    }

    private onFilter(value: string): void {
        if (!this.interacted) this.interacted = true;
        this.control.setValue(null);
        this.control.markAsPristine();
        this.control.markAsUntouched();
        this.filterCategories(value);
    }

    private filterCategories(value: string): void {
        this.filteredCategories = this.categories.filter((category) =>
            category.value.toLowerCase().includes(value.toLowerCase()),
        );
    }

    private setControl(): void {
        this.control = this.controlContainer.control?.get(
            this.controlName,
        ) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }

    public emitSelected() {
        this.selected.emit();
    }
}
