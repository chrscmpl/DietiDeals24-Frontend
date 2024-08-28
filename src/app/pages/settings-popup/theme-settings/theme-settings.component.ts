import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ThemeService, theme } from '../../../services/theme.service';
import { debounceTime, Observable, skip, Subscription, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'dd24-theme-settings',
    standalone: true,
    imports: [
        RadioButtonModule,
        ReactiveFormsModule,
        AsyncPipe,
        ProgressSpinnerModule,
        SelectButtonModule,
    ],
    templateUrl: './theme-settings.component.html',
    styleUrl: './theme-settings.component.scss',
})
export class ThemeSettingsComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public themeForm = new FormGroup({
        theme: new FormControl<theme | 'system' | null>(null),
        lightThemeVariation: new FormControl<string | null>(null),
        darkThemeVariation: new FormControl<string | null>(null),
    });
    public currentTheme: theme | null = null;

    private lightThemeVariationOptions = [
        ...this.themeService.lightThemeVariations,
    ];

    private darkThemeVariationOptions = [
        ...this.themeService.darkThemeVariations,
    ];

    public themeVariationOptions = [
        {
            theme: 'light',
            controlName: 'lightThemeVariation',
            options: this.lightThemeVariationOptions,
        },
        {
            theme: 'dark',
            controlName: 'darkThemeVariation',
            options: this.darkThemeVariationOptions,
        },
    ];

    public themeLoading$: Observable<boolean> =
        this.themeService.themeLoading$.pipe(debounceTime(100));

    constructor(private readonly themeService: ThemeService) {}

    public ngOnInit(): void {
        this.subscriptions = this.subscriptions.concat([
            this.themeForm.controls.theme.valueChanges
                .pipe(skip(1))
                .subscribe((value) => {
                    if (value) this.themeService.setTheme(value);
                }),

            this.themeForm.controls.lightThemeVariation.valueChanges
                .pipe(skip(1))
                .subscribe((value) => {
                    this.themeService.setThemeVariation(
                        'light',
                        value ?? 'default',
                    );
                }),

            this.themeForm.controls.darkThemeVariation.valueChanges
                .pipe(skip(1))
                .subscribe((value) => {
                    this.themeService.setThemeVariation(
                        'dark',
                        value ?? 'default',
                    );
                }),

            this.themeService.themeStatus$.subscribe((theme) => {
                this.currentTheme = theme.theme;
            }),
        ]);

        this.themeService.themeStatus$.pipe(take(1)).subscribe((theme) => {
            if (theme.isSystemPreference)
                this.themeForm.controls.theme.setValue('system');
            else this.themeForm.controls.theme.setValue(theme.theme);
            this.themeForm.controls.lightThemeVariation.setValue(
                theme.variations.light,
            );
            this.themeForm.controls.darkThemeVariation.setValue(
                theme.variations.dark,
            );
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe(),
        );
    }
}
