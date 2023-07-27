import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropDown]',
  exportAs:'appDropDown'
})
export class DropDownDirective {

  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleopen() {
     console.log(1);
    this.isOpen = !this.isOpen;
  }

}
