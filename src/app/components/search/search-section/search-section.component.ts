import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';

interface searchForm {
    keywords: FormControl<string | null>;
}

@Component({
    selector: 'dd24-search-section',
    standalone: true,
    imports: [ReactiveFormsModule, SearchBarComponent],
    templateUrl: './search-section.component.html',
    styleUrl: './search-section.component.scss',
})
export class SearchSectionComponent implements OnInit {
    constructor(private formBuilder: FormBuilder) {}
    searchForm!: FormGroup<searchForm>;

    ngOnInit(): void {
        this.searchForm = this.formBuilder.group<searchForm>({
            keywords: new FormControl(''),
        });
    }

    handleSubmit(): void {}
}
