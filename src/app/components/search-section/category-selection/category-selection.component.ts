import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    Dropdown,
    DropdownFilterEvent,
    DropdownModule,
} from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { OneCharUpperPipe } from '../../../pipes/one-char-upper.pipe';
import { ButtonModule } from 'primeng/button';

interface option {
    name: string;
    value: string | null;
    macroCategory: number;
}

interface group {
    groupName: string;
    items: option[];
    macroCategory: number;
}

@Component({
    selector: 'dd24-category-selection',
    standalone: true,
    imports: [
        DropdownModule,
        ReactiveFormsModule,
        TabMenuModule,
        AsyncPipe,
        ButtonModule,
    ],
    templateUrl: './category-selection.component.html',
    styleUrl: './category-selection.component.scss',
})
export class CategorySelectionComponent implements OnInit, OnDestroy {
    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) controlName!: string;

    @Output() valueChange: EventEmitter<void> = new EventEmitter();

    @ViewChild('dropdown') dropdown!: Dropdown;

    public defaultGroup: group = {
        groupName: 'Default',
        items: [{ name: 'All categories', value: null, macroCategory: 0 }],
        macroCategory: 0,
    };

    private currentOptionsSubject = new ReplaySubject<group[]>(1);
    public currentOptions$: Observable<group[]> =
        this.currentOptionsSubject.asObservable();

    public showUI: boolean = true;

    public value: string | null = null;

    public selectedMacroCategory: number = 1;

    public tabs: MenuItem[] = [];

    public currentTab?: MenuItem;

    constructor(private readonly categoriesService: CategoriesService) {}

    ngOnInit(): void {
        this.categoriesService.categories$.subscribe((categories) => {
            let macroCategoryIndex = 1;
            const tabs: MenuItem[] = [];
            const groups: group[] = [];
            const hiddenOptions: group = {
                groupName: 'Hidden',
                items: [
                    { name: 'All categories', value: null, macroCategory: -1 },
                ],
                macroCategory: -1,
            };
            groups.push(hiddenOptions);
            Object.keys(categories).forEach((key) => {
                const index = macroCategoryIndex++;
                groups.push({
                    groupName: key,
                    items: categories[key].map((str) =>
                        this.stringToOption(str, index),
                    ),
                    macroCategory: index,
                });
                hiddenOptions.items.push({
                    name: `All ${key}`,
                    value: key,
                    macroCategory: -1,
                });
                tabs.push({
                    label: OneCharUpperPipe.transform(key),
                    command: () => (this.selectedMacroCategory = index),
                });
            });
            this.tabs = tabs;
            this.currentTab = tabs[0];
            this.currentOptionsSubject.next(groups);
        });
        this.form.controls[this.controlName]?.valueChanges.subscribe(
            (value) => {
                this.value = value;
            },
        );
    }

    ngOnDestroy(): void {
        this.currentOptionsSubject.complete();
    }

    public setValue(value: string | null): void {
        const oldValue = this.form.controls[this.controlName]?.value;
        this.form.controls[this.controlName]?.setValue(value);
        this.dropdown.hide();
        if (oldValue !== value) this.valueChange.emit();
    }

    public onFilter(event: DropdownFilterEvent): void {
        this.showUI = event.filter.length === 0;
    }

    public emitChange(): void {
        this.valueChange.emit();
    }

    private stringToOption(str: string, macroCategory: number): option {
        return {
            name: OneCharUpperPipe.transform(str),
            value: str,
            macroCategory: macroCategory,
        };
    }
}
