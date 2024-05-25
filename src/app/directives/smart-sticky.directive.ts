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
    private _sticky = false;
    private _shown = false;
    private scrollPosition = 0;
    private lastScrollPosition = 0;
    private stylesheet: HTMLStyleElement | null = null;
    private animationStylesheet: HTMLStyleElement | null = null;
    private _transitionTime = 0.3;

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

    @Input() set transitionTime(value: number) {
        this._transitionTime = value;
        this.setRules();
    }

    public get transitionTime(): number {
        return this._transitionTime;
    }

    constructor(
        private element: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngAfterViewInit(): void {
        if (!this.stylesheet) this.setRules();
        this.setAnimation();
        this.setOffsets();
        this.renderer.addClass(this.element.nativeElement, `dd24-smart-sticky`);
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    private onScroll(): void {
        this.scrollPosition =
            window.scrollY || document.documentElement.scrollTop;

        const height = this.element.nativeElement.clientHeight;

        if (this.scrollPosition === 0) {
            this.sticky = false;
        } else if (
            this.sticky &&
            !this.shown &&
            this.scrollPosition > height &&
            this.scrollPosition < height + 10
        ) {
            this.sticky = false;
        } else if (this.scrollPosition > height) {
            if (
                this.shown &&
                this.scrollPosition > this.lastTurn + this.offsetHide
            ) {
                this.shown = false;
            } else {
                if (this.scrollPosition < this.lastTurn - this.offsetShow) {
                    if (!this.sticky) this.sticky = true;
                    this.shown = true;
                }
            }
        }

        this.updateScrollingDirection();

        this.lastScrollPosition = this.scrollPosition;
    }

    private get sticky(): boolean {
        return this._sticky;
    }

    private set sticky(value: boolean) {
        this._sticky = value;
        if (value) {
            this.renderer.addClass(this.element.nativeElement, 'dd24ss-sticky');
        } else {
            this._shown = false;
            this.renderer.removeClass(
                this.element.nativeElement,
                'dd24ss-sticky',
            );
            this.renderer.removeClass(
                this.element.nativeElement,
                'dd24ss-shown',
            );
            this.renderer.removeClass(
                this.element.nativeElement,
                'dd24ss-hidden',
            );
        }
    }

    private get shown(): boolean {
        return this._shown;
    }

    private set shown(value: boolean) {
        this._shown = value;
        if (value) {
            this.renderer.addClass(this.element.nativeElement, 'dd24ss-shown');
            this.renderer.removeClass(
                this.element.nativeElement,
                'dd24ss-hidden',
            );
        } else {
            this.renderer.addClass(this.element.nativeElement, 'dd24ss-hidden');
            this.renderer.removeClass(
                this.element.nativeElement,
                'dd24ss-shown',
            );
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
        if (this.stylesheet)
            this.renderer.removeChild(document.head, this.stylesheet);

        this.stylesheet = this.renderer.createElement('style');

        const text = this.renderer.createText(
            `
            .dd24-smart-sticky.dd24ss-sticky{
                position:sticky;
            }
            .dd24-smart-sticky.dd24ss-sticky.dd24ss-shown{
                animation: dd24-smart-sticky-slide-in ${this.transitionTime}s ease-in-out;
            }
            .dd24-smart-sticky.dd24ss-sticky.dd24ss-hidden{
                animation: dd24-smart-sticky-slide-out ${this.transitionTime}s ease-in-out forwards;
            }
            `,
        );

        this.renderer.appendChild(this.stylesheet, text);
        this.renderer.appendChild(document.head, this.stylesheet);
    }

    private setAnimation(): void {
        if (this.animationStylesheet)
            this.renderer.removeChild(document.head, this.animationStylesheet);

        this.animationStylesheet = this.renderer.createElement('style');

        const text = this.renderer.createText(
            `
            @keyframes dd24-smart-sticky-slide-in {
                0% {
                    transform: translateY(-100%);
                }
                100% {
                    transform: translateY(0);
                }
            }
            @keyframes dd24-smart-sticky-slide-out {
                0% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(-100%);
                }
            }
            `,
        );

        this.renderer.appendChild(this.animationStylesheet, text);
        this.renderer.appendChild(document.head, this.animationStylesheet);
    }

    private setOffsets(): void {
        if (this.offsetHide === -1) {
            this.offsetHide = this.element.nativeElement.clientHeight;
        }
        if (this.offsetShow === -1) {
            this.offsetShow = this.element.nativeElement.clientHeight;
        }
    }
}
