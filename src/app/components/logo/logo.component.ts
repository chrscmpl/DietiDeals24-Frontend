import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dd24-logo',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
})
export class LogoComponent {
    @Input() public containerStyle: {
        [key: string]: string | number | boolean;
    } = {};
    @Output() public clickEvent: EventEmitter<void> = new EventEmitter<void>();
}
