import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appDropDown]',
    exportAs: 'appDropDown',
    standalone: false
})
export class DropDownDirective {

  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleopen() {
    this.isOpen = !this.isOpen;
  }

}
