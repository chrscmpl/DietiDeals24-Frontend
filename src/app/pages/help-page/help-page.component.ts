import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { debounceTime, Subscription, take } from 'rxjs';

@Component({
    selector: 'dd24-help-page',
    standalone: true,
    imports: [
        PanelMenuModule,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        ReactiveFormsModule,
    ],
    templateUrl: './help-page.component.html',
    styleUrl: './help-page.component.scss',
})
export class HelpPageComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    public faqMenuItems: MenuItem[] = [];
    public filteredFaqMenuItems: MenuItem[] = [];

    public readonly filterControl = new FormControl<string>('');

    public constructor(
        private readonly route: ActivatedRoute,
        public readonly location: Location,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.faqMenuItems = this.faqArrayToMenuItems(data['faq']);

            this.filteredFaqMenuItems = this.faqMenuItems;
        });

        this.subscriptions.push(
            this.filterControl.valueChanges
                .pipe(debounceTime(500))
                .subscribe(this.onFilterChange.bind(this)),
        );
    }

    private faqArrayToMenuItems(arr: { q: string; a: string }[]): MenuItem[] {
        return arr.map((faq: { q: string; a: string }) => ({
            label: faq.q,
            items: [
                {
                    label: faq.a,
                },
            ],
        }));
    }

    private onFilterChange(filter: string | null): void {
        this.filteredFaqMenuItems =
            !filter || filter.length < 3
                ? this.faqMenuItems
                : this.faqMenuItems.filter((faq: MenuItem) =>
                      (faq.label as string)
                          .toLowerCase()
                          .includes(filter.toLowerCase()),
                  );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe(),
        );
    }
}
