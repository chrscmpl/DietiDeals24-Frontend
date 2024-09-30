import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    ControlContainer,
    FormControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { InputTextModule } from 'primeng/inputtext';
import { RadioToggleButtonComponent } from '../radio-toggle-button/radio-toggle-button.component';
import { debounceTime, filter, fromEvent, map, Subscription, take } from 'rxjs';
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
export class AuctionCreationCategorySelectionComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private readonly subscriptions: Subscription[] = [];
    @Input({ required: true }) public controlName!: string;

    @Output() public selected = new EventEmitter<void>();

    @ViewChild('filterInput') public filterInput!: ElementRef;

    public control!: FormControl;

    public interacted: boolean = false;

    private categories: { value: string; index: number }[] = [];
    public filteredCategories: { value: string; index: number }[] = [];
    public macroCategories: string[] = [];

    public placeholder: string = '';

    public constructor(
        private readonly controlContainer: ControlContainer,
        private readonly categoriesService: CategoriesService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {}

    public ngOnInit(): void {
        this.setControl();

        this.categoriesService.categories$
            .pipe(take(1))
            .subscribe((categories) => {
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
                    this.interacted = true;
                    this.control.markAsDirty();
                    this.filterCategories(this.control.value);
                }
            });
    }

    public ngAfterViewInit(): void {
        this.subscriptions.push(
            fromEvent<InputEvent>(this.filterInput.nativeElement, 'input', {
                passive: true,
            })
                .pipe(
                    debounceTime(500),
                    map((event) => (event.target as HTMLInputElement).value),
                    filter((value) => value.length !== 1),
                )
                .subscribe(this.onFilter.bind(this)),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    private onFilter(value: string): void {
        if (!this.interacted) this.interacted = true;
        this.control.markAsPristine();
        this.control.markAsUntouched();
        this.filterCategories(value);
        this.changeDetectorRef.detectChanges();
    }

    private filterCategories(value: string): void {
        this.filteredCategories = value.length
            ? this.categories.filter((category) =>
                  category.value.toLowerCase().includes(value.toLowerCase()),
              )
            : this.categories;
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
