import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[dd24SetDescendantAttributes]',
    standalone: true,
})
export class SetDescendantAttributesDirective implements AfterViewInit {
    @Input({ required: true }) querySelector!: string;

    @Input({ required: true }) attributes!: {
        [key: string]: string;
    };

    constructor(private readonly element: ElementRef) {}

    ngAfterViewInit(): void {
        const input = this.element.nativeElement.querySelector(
            this.querySelector,
        );
        if (!input) return;
        for (const entry of Object.entries(this.attributes))
            input.setAttribute(entry[0], entry[1]);
    }
}
