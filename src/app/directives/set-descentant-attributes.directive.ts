import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: '[dd24DescendantsAttributes]',
    standalone: true,
})
export class DescendantsAttributesDirective implements AfterViewInit {
    @Input({ required: true }) dd24DescendantsAttributes!: {
        selectors: string[];
        attributes: {
            [key: string]: string;
        };
    }[];

    constructor(
        private readonly element: ElementRef,
        private readonly renderer: Renderer2,
    ) {}

    public ngAfterViewInit(): void {
        for (const entry of this.dd24DescendantsAttributes) {
            const descendants: HTMLElement[] =
                this.element.nativeElement.querySelectorAll(...entry.selectors);
            for (const descendant of descendants) {
                for (const attribute of Object.entries(entry.attributes)) {
                    this.renderer.setAttribute(
                        descendant,
                        attribute[0],
                        attribute[1],
                    );
                }
            }
        }
    }
}
