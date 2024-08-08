import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { take } from 'rxjs';

@Component({
    selector: 'dd24-help-page',
    standalone: true,
    imports: [PanelMenuModule],
    templateUrl: './help-page.component.html',
    styleUrl: './help-page.component.scss',
})
export class HelpPageComponent implements OnInit {
    faqMenuItems: MenuItem[] = [];

    public constructor(private readonly route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.faqMenuItems = data['faq'].map(
                (faq: { q: string; a: string }) => ({
                    label: faq.q,
                    items: [
                        {
                            label: faq.a,
                        },
                    ],
                }),
            );
        });
    }
}
