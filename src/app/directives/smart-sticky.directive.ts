import {
    Directive,
    ElementRef,
    AfterViewInit,
    Renderer2,
    Input,
} from '@angular/core';

enum Directions {
    UP = 0,
    DOWN = 1,
}

@Directive({
    selector: '[dd24SmartSticky]',
    standalone: true,
})
export class SmartStickyDirective implements AfterViewInit {
    private lastTurn = 0;
    private _scrollingDown: Directions = Directions.DOWN;
    private _shown = false;
    private scrollPosition = 0;
    private lastScrollPosition = 0;

    private offsetHide = -1;
    private offsetShow = -1;

    @Input() set showOffset(value: number) {
        if (value < 0) {
            throw new Error(
                'SmartStickyDirective: showOffset must be greater than 0',
            );
        }
        this.offsetShow = value;
    }

    @Input() set hideOffset(value: number) {
        if (value < 0) {
            throw new Error(
                'SmartStickyDirective: hideOffset must be greater than 0',
            );
        }
        this.offsetHide = value;
    }

    constructor(
        private element: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngAfterViewInit(): void {
        this.setRules();
        this.renderer.addClass(this.element.nativeElement, 'dd24-smart-sticky');
        this.shown = true;
        this.setOffsets();
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    private onScroll(): void {
        this.scrollPosition =
            window.scrollY || document.documentElement.scrollTop;
        if (this.shown) {
            if (this.scrollPosition > this.lastTurn + this.offsetHide) {
                this.shown = false;
            }
        } else {
            if (this.scrollPosition < this.lastTurn - this.offsetShow) {
                this.shown = true;
            }
        }

        this.updateScrollingDirection();

        this.lastScrollPosition = this.scrollPosition;
    }

    private get shown(): boolean {
        return this._shown;
    }

    private set shown(value: boolean) {
        this._shown = value;
        if (value) {
            this.renderer.addClass(this.element.nativeElement, 'shown');
        } else {
            this.renderer.removeClass(this.element.nativeElement, 'shown');
        }
    }

    private updateScrollingDirection(): void {
        if (this.scrollPosition < this.lastScrollPosition) {
            this.setScrollingDirection(Directions.UP);
        } else if (this.scrollPosition > this.lastScrollPosition) {
            this.setScrollingDirection(Directions.DOWN);
        }
    }

    private setScrollingDirection(value: Directions) {
        if (this._scrollingDown !== value) {
            this.lastTurn = this.scrollPosition;
        }
        this._scrollingDown = value;
    }

    private setRules(): void {
        const style = this.renderer.createElement('style');

        const text = this.renderer.createText(
            '.dd24-smart-sticky{transform:translateY(-100%);position:sticky;transition:transform 0.3s;}.dd24-smart-sticky.shown{transform:translateY(0);}',
        );

        this.renderer.appendChild(style, text);
        this.renderer.appendChild(document.head, style);
    }

    private setOffsets(): void {
        if (this.offsetHide === -1) {
            this.offsetHide = this.element.nativeElement.clientHeight * 0.75;
        }
        if (this.offsetShow === -1) {
            this.offsetShow = this.element.nativeElement.clientHeight;
        }
    }
}
