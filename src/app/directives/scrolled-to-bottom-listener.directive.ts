import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Output,
} from '@angular/core';

@Directive({
    selector: '[dd24ScrolledToBottomListener]',
    standalone: true,
})
export class ScrolledToBottomListenerDirective {
    @Output() public scrolledToBottom: EventEmitter<void> =
        new EventEmitter<void>();

    constructor(private element: ElementRef) {}

    @HostListener('scroll')
    public onScroll(): void {
        const element = this.element.nativeElement;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            this.scrolledToBottom.emit();
        }
    }
}
