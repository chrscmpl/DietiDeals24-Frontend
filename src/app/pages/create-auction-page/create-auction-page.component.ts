import { Component } from '@angular/core';
import { RadioToggleButtonComponent } from '../../components/radio-toggle-button/radio-toggle-button.component';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'dd24-create-auction-page',
    standalone: true,
    imports: [RadioToggleButtonComponent],
    templateUrl: './create-auction-page.component.html',
    styleUrl: './create-auction-page.component.scss',
})
export class CreateAuctionPageComponent {}
