import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'dd24-loading-placeholder',
    standalone: true,
    imports: [ProgressSpinnerModule, SkeletonModule],
    templateUrl: './loading-placeholder.component.html',
    styleUrl: './loading-placeholder.component.scss',
})
export class LoadingPlaceholderComponent {}
