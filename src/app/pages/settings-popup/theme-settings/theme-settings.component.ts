import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ThemeService, theme } from '../../../services/theme.service';
import { debounceTime, Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'dd24-theme-settings',
    standalone: true,
    imports: [
        RadioButtonModule,
        ReactiveFormsModule,
        AsyncPipe,
        ProgressSpinnerModule,
    ],
    templateUrl: './theme-settings.component.html',
    styleUrl: './theme-settings.component.scss',
})
export class ThemeSettingsComponent implements OnInit {
    public themeControl!: FormControl<theme | 'system' | null>;

    public themeLoading$: Observable<boolean> =
        this.themeService.themeLoading$.pipe(debounceTime(100));

    constructor(private readonly themeService: ThemeService) {}

    ngOnInit(): void {
        this.themeControl = new FormControl<theme | 'system' | null>(null);

        this.themeService.themeStatus$.pipe(take(1)).subscribe((theme) => {
            if (theme.isSystemPreference) this.themeControl.setValue('system');
            else this.themeControl.setValue(theme.theme);
        });
        this.themeControl.valueChanges.subscribe((value) => {
            if (value) this.themeService.setTheme(value);
        });
    }
}
