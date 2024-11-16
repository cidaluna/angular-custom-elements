import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBtnCustom]',
  standalone: true
})
export class BtnCustomDirective {
  @Input() buttonType: 'raised' | 'stroked' | 'flat' = 'raised';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() isDisabled: boolean = false;
  @Input() buttonText: string = 'Button';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyStyles();
  }

  private applyStyles() {
    //this.renderer.addClass(this.el.nativeElement, `mat-${this.buttonType}-button`);
    if (this.buttonType === 'stroked') {
      this.renderer.addClass(this.el.nativeElement, 'mat-stroked-button');
    } else if (this.buttonType === 'raised') {
      this.renderer.addClass(this.el.nativeElement, 'mat-raised-button');
    } else if (this.buttonType === 'flat') {
      this.renderer.addClass(this.el.nativeElement, 'mat-flat-button');
    }
    this.renderer.setAttribute(this.el.nativeElement, 'color', this.color);
    if (this.isDisabled) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    }
    this.el.nativeElement.textContent = this.buttonText;
  }
}
