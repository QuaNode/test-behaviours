import { Component } from '@angular/core';

@Component({
<<<<<<< HEAD
  selector: 'app-footer',

=======
  selector: 'footer-component',
  imports: [],
>>>>>>> origin/mahmoudrabea
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
