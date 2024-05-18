import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { OneCharUpperPipe } from '../../../pipes/one-char-upper.pipe';

interface option {
    name: string;
    value: string | null;
    macroCategory: number;
}

interface group {
    groupName: string;
    items: option[];
}

@Component({
    selector: 'dd24-category-selection',
    standalone: true,
    imports: [
        DropdownModule,
        ReactiveFormsModule,
        TabMenuModule,
        AsyncPipe,
        JsonPipe,
    ],
    templateUrl: './category-selection.component.html',
    styleUrl: './category-selection.component.scss',
})
export class CategorySelectionComponent implements OnInit, OnDestroy {
    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) controlName!: string;

    private currentOptionsSubject = new ReplaySubject<group[]>(1);
    public currentOptions$: Observable<group[]> =
        this.currentOptionsSubject.asObservable();

    public selectedMacroCategory: number = 1;

    public allCategoriesGroup: group = {
        groupName: 'All',
        items: [
            {
                name: 'All categories',
                value: null,
                macroCategory: 0,
            },
        ],
    };

    public tabs: MenuItem[] = [];

    public currentTab?: MenuItem;

    constructor(
        private categoriesService: CategoriesService,
        private oneCharUpperPipe: OneCharUpperPipe,
    ) {}

    ngOnInit(): void {
        this.categoriesService.refreshCategories({
            error: (err) => {
                console.error(err);
            },
        });
        this.categoriesService.categories$.subscribe((categories) => {
            let macroCategoryIndex = 0;
            const tabs: MenuItem[] = [];
            const options: option[] = [];
            Object.keys(categories).forEach((key) => {
                const index = ++macroCategoryIndex;
                options.push(
                    {
                        name: `All ${key}`,
                        value: key,
                        macroCategory: index,
                    },
                    ...categories[key].map((str) =>
                        this.stringToOption(str, index),
                    ),
                );
                tabs.push({
                    label: this.oneCharUpperPipe.transform(key),
                    command: () => (this.selectedMacroCategory = index),
                });
            });
            this.tabs = tabs;
            this.currentTab = tabs[0];
            this.currentOptionsSubject.next([
                this.allCategoriesGroup,
                {
                    groupName: 'items',
                    items: options,
                },
            ]);
        });
    }

    ngOnDestroy(): void {
        this.currentOptionsSubject.complete();
    }

    private stringToOption(str: string, macroCategory: number): option {
        return {
            name: this.oneCharUpperPipe.transform(str),
            value: str,
            macroCategory: macroCategory,
        };
    }
}
