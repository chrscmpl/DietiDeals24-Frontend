import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

enum MacroCategory {
    Product,
    Service,
    All,
}

interface option {
    name: string;
    value: string | null;
    macroCategory: MacroCategory;
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

    public MACROCATEGORIES = MacroCategory;

    public categoriesOptions: {
        all: option;
        products: option[];
        services: option[];
    } = {
        all: {
            name: 'All categories',
            value: null,
            macroCategory: MacroCategory.All,
        },
        products: [],
        services: [],
    };

    private currentOptionsSubject = new ReplaySubject<group[]>(1);
    public currentOptions$: Observable<group[]> =
        this.currentOptionsSubject.asObservable();

    public selectedMacroCategory: MacroCategory = MacroCategory.Product;

    public tabs: MenuItem[] = [
        {
            label: 'Products',
            command: () => (this.selectedMacroCategory = MacroCategory.Product),
        },
        {
            label: 'Services',
            command: () => (this.selectedMacroCategory = MacroCategory.Service),
        },
    ];

    public currentTab: MenuItem = this.tabs[0];

    private removeFirstCharFromValueFlag = false;

    constructor(private categoriesService: CategoriesService) {}

    ngOnInit(): void {
        this.categoriesService.categories$.subscribe((categories) => {
            this.categoriesOptions.products = (
                [
                    {
                        name: 'All products',
                        value: 'pproducts',
                        macroCategory: MacroCategory.Product,
                    },
                ] as option[]
            ).concat(
                categories.products.map((str) =>
                    this.stringToOption(str, MacroCategory.Product),
                ),
            );
            this.categoriesOptions.services = (
                [
                    {
                        name: 'All services',
                        value: 'sservices',
                        macroCategory: MacroCategory.Service,
                    },
                ] as option[]
            ).concat(
                categories.services.map((str) =>
                    this.stringToOption(str, MacroCategory.Service),
                ),
            );
            this.refreshOptions();
        });
        this.categoriesService.refreshCategories({
            error: (err) => {
                console.error(err);
            },
        });
    }

    ngOnDestroy(): void {
        this.currentOptionsSubject.complete();
    }

    public allCategoriesGroup: group = {
        groupName: 'All',
        items: [this.categoriesOptions.all],
    };

    public refreshOptions(): void {
        this.currentOptionsSubject.next([
            this.allCategoriesGroup,
            {
                groupName: 'items',
                items: [
                    ...this.categoriesOptions.products,
                    ...this.categoriesOptions.services,
                ],
            },
        ]);
        this.form.get(this.controlName)?.setValue(null);
    }

    private stringToOption(str: string, macroCategory: MacroCategory): option {
        return { name: str, value: str, macroCategory: macroCategory };
    }
}
