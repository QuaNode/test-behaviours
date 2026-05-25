import { Component, inject } from '@angular/core';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false,
})
export class LayoutComponent {
  public requestsService = inject(RequestsService);
}
