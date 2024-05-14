import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

interface option {
    name: string;
    value: string | null;
}

interface group {
    groupName: string;
    items: option[];
}

@Component({
    selector: 'dd24-category-selection',
    standalone: true,
    imports: [DropdownModule, ReactiveFormsModule, TabMenuModule, AsyncPipe],
    templateUrl: './category-selection.component.html',
    styleUrl: './category-selection.component.scss',
})
export class CategorySelectionComponent implements OnInit, OnDestroy {
    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) controlName!: string;

    public categoriesOptions: {
        all: option;
        products: option[];
        services: option[];
    } = {
        all: { name: 'All categories', value: null },
        products: [],
        services: [],
    };

    private currentOptionsSubject = new ReplaySubject<group[]>(1);
    public currentOptions$: Observable<group[]> =
        this.currentOptionsSubject.asObservable();

    public tabs: MenuItem[] = [
        {
            label: 'Products',
            command: () => this.refreshOptions('Products'),
        },
        {
            label: 'Services',
            command: () => this.refreshOptions('Services'),
        },
    ];

    public currentTab: MenuItem = this.tabs[0];

    constructor(private categoriesService: CategoriesService) {}

    ngOnInit(): void {
        this.categoriesService.categories$.subscribe((categories) => {
            this.categoriesOptions.products = (
                [{ name: 'All products', value: 'products' }] as option[]
            ).concat(categories.products.map(this.stringToOption));
            this.categoriesOptions.services = (
                [{ name: 'All services', value: 'services' }] as option[]
            ).concat(categories.services.map(this.stringToOption));
            this.refreshOptions(
                this.currentTab.label as 'Products' | 'Services',
            );
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

    public refreshOptions(tab: 'Products' | 'Services'): void {
        this.currentOptionsSubject.next([
            this.allCategoriesGroup,
            {
                groupName: tab,
                items:
                    tab === 'Products'
                        ? this.categoriesOptions.products
                        : this.categoriesOptions.services,
            },
        ]);
        this.form.get(this.controlName)?.setValue(null);
    }

    private stringToOption(s: string): option {
        return { name: s, value: s };
    }
}
