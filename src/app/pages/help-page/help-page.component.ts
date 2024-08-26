import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { combineLatest, debounceTime, Subscription, take } from 'rxjs';
import { FAQ } from '../../models/faq.model';
import { WindowService } from '../../services/window.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'dd24-help-page',
    standalone: true,
    imports: [
        PanelMenuModule,
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
        IconFieldModule,
        InputIconModule,
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
        public readonly navigation: NavigationService,
        private readonly viewPortScroller: ViewportScroller,
        private readonly windowService: WindowService,
    ) {}

    public ngOnInit(): void {
        combineLatest([this.route.data, this.route.fragment])
            .pipe(take(1))
            .subscribe(([data, fragment]) => {
                this.faqMenuItems = this.faqArrayToMenuItems(
                    data['faq'],
                    fragment,
                );

                this.filteredFaqMenuItems = this.faqMenuItems;

                if (fragment) this.scrollToFaqItem(fragment);
            });

        this.subscriptions.push(
            this.filterControl.valueChanges
                .pipe(debounceTime(500))
                .subscribe(this.onFilterChange.bind(this)),
        );
    }

    private faqArrayToMenuItems(
        arr: FAQ[],
        fragment: string | null,
    ): MenuItem[] {
        return arr.map((faq: FAQ) => ({
            label: faq.question,
            items: [
                {
                    label: faq.answer,
                },
            ],
            expanded: fragment === faq.fragment,
            id: faq.fragment,
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

    private scrollToFaqItem(fragment: string): void {
        this.windowService.setSmoothScrolling(true);
        setTimeout(() => {
            this.viewPortScroller.scrollToAnchor(`${fragment}_header`);
            setTimeout(() => {
                this.windowService.setSmoothScrolling(false);
            }, 1000);
        }, 100);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe(),
        );
    }
}
