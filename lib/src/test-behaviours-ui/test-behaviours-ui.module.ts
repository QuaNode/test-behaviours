import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { FormPaneComponent } from './common/components/form-pane/form-pane.component';
import { DropDownDirective } from './common/directives/drop-down.directive';
import { LayoutComponent } from './common/components/layout/layout.component';
import { JsonTextAreaComponent } from './common/components/json-text-area/json-text-area.component';

@NgModule({
  declarations: [
    SideMenuComponent,
    FormPaneComponent,
    DropDownDirective,
    JsonTextAreaComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [LayoutComponent],
 })

export class TestBehavioursUiModule { }
