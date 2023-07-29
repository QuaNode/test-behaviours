import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { FormPaneComponent } from './common/components/form-pane/form-pane.component';
import { DropDownDirective } from './common/directives/drop-down.directive';
import { DataServicesFactory } from './common/services/data-services/data.factory';

@NgModule({
  declarations: [
    SideMenuComponent,
    FormPaneComponent,
    DropDownDirective
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    DataServicesFactory
  ],

  exports: [SideMenuComponent],
 })
export class TestBehavioursUiModule { }
