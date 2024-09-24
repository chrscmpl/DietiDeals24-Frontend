import { Component } from '@angular/core';
import { link, mainPages } from '../../helpers/links.helper';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dd24-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    links: link[] = mainPages;
}
