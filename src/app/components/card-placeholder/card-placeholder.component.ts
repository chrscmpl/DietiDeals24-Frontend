import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'dd24-cards-placeholder',
    standalone: true,
    imports: [SkeletonModule],
    templateUrl: './cards-placeholder.component.html',
    styleUrl: './cards-placeholder.component.scss',
})
export class CardsPlaceholderComponent {}
