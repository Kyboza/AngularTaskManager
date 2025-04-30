import { Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverClass]',
})
export class HoverColorDirective {
  @Input() public hoverClass: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (this.hoverClass) {
      this.renderer.addClass(this.el.nativeElement, this.hoverClass);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.hoverClass) {
      this.renderer.removeClass(this.el.nativeElement, this.hoverClass);
    }
  }
}
