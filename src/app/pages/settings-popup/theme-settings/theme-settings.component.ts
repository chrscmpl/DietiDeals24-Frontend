import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ThemeService, theme } from '../../../services/theme.service';

@Component({
    selector: 'dd24-theme-settings',
    standalone: true,
    imports: [RadioButtonModule, ReactiveFormsModule],
    templateUrl: './theme-settings.component.html',
    styleUrl: './theme-settings.component.scss',
})
export class ThemeSettingsComponent implements OnInit {
    public themeControl!: FormControl<theme | 'system' | null>;

    constructor(private themeService: ThemeService) {}

    ngOnInit(): void {
        this.themeControl = new FormControl<theme | 'system' | null>(null);

        this.themeService.theme$.subscribe((theme) => {
            if (theme.isSystemPreference) this.themeControl.setValue('system');
            else this.themeControl.setValue(theme.theme);

            this.themeControl.valueChanges.subscribe((value) => {
                if (value) this.themeService.setTheme(value);
            });
        });
    }
}
