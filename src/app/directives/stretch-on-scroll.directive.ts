import {
    Directive,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
} from '@angular/core';
import { fromEvent, Observable, Subscription, throttleTime } from 'rxjs';

@Directive({
    selector: '[dd24StretchOnScroll]',
    standalone: true,
})
export class StretchOnScrollDirective implements OnInit, OnDestroy {
    private offset: number = 0;
    private maxScale: number = 1.01;
    private startingScreenY: number | null = null;
    private _isBottomTheOrigin: boolean = false;
    private _scale: number = 1;
    private maxScaleReached: boolean = false;

    private touchmove$: Observable<TouchEvent> = fromEvent<TouchEvent>(
        this.element.nativeElement,
        'touchmove',
        { passive: true },
    ).pipe(throttleTime(100));

    private touchend$: Observable<TouchEvent> = fromEvent<TouchEvent>(
        this.element.nativeElement,
        'touchend',
        { passive: true },
    );

    private readonly subscriptions: Subscription[] = [];

    constructor(
        private element: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            ...[
                this.touchmove$.subscribe(this.onTouchMove.bind(this)),
                this.touchend$.subscribe(this.onTouchEnd.bind(this)),
            ],
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe(),
        );
    }

    onTouchMove(event: TouchEvent): void {
        const scrolledToTop = this.isScrolledToTop();
        const scrolledToBottom = this.isScrolledToBottom();
        const screenY = event.touches[0].screenY;

        if (
            this.startingScreenY === null &&
            (scrolledToTop || scrolledToBottom)
        ) {
            this.startingScreenY = screenY;
            return;
        }

        if (this.offset === 0 && (scrolledToTop || scrolledToBottom)) {
            this.renderer.setStyle(
                this.element.nativeElement,
                'transition',
                'none',
            );
        }

        if (scrolledToTop && screenY > this.startingScreenY!) {
            this.offset = screenY - this.startingScreenY!;
            if (this.isBottomTheOrigin) {
                this.isBottomTheOrigin = false;
            }
        } else if (scrolledToBottom && screenY < this.startingScreenY!) {
            this.offset = this.startingScreenY! - screenY;
            if (!this.isBottomTheOrigin) {
                this.isBottomTheOrigin = true;
            }
        } else {
            this.offset = 0;
            return;
        }

        if (this.offset) {
            this.scale = 1 + this.offset / 1000;
        }
    }

    onTouchEnd(): void {
        this.renderer.setStyle(
            this.element.nativeElement,
            'transition',
            'transform 0.2s ease-in-out',
        );
        this.scale = 1;
        this.offset = 0;
        this.startingScreenY = null;
    }

    private get isBottomTheOrigin(): boolean {
        return this._isBottomTheOrigin;
    }

    private set isBottomTheOrigin(value: boolean) {
        this._isBottomTheOrigin = value;
        this.renderer.setStyle(
            this.element.nativeElement,
            'transform-origin',
            value ? 'bottom' : 'top',
        );
    }

    private get scale(): number {
        return this._scale;
    }

    private set scale(value: number) {
        if (value > this.maxScale) {
            if (this.maxScaleReached) {
                return;
            }
            value = this.maxScale;
            this.maxScaleReached = true;
        } else {
            this.maxScaleReached = false;
        }
        this._scale = value;
        this.renderer.setStyle(
            this.element.nativeElement,
            'transform',
            value !== 1 ? `scaleY(${value})` : 'none',
        );
    }

    private isScrolledToBottom(): boolean {
        return (
            this.element.nativeElement.scrollHeight ===
            this.element.nativeElement.scrollTop +
                this.element.nativeElement.clientHeight
        );
    }

    private isScrolledToTop(): boolean {
        return this.element.nativeElement.scrollTop === 0;
    }
}
