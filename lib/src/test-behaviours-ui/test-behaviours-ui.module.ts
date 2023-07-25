import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { PaneFormComponent } from './common/components/pane-form/pane-form.component';


@NgModule({
  declarations: [
    SideMenuComponent,
    PaneFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [SideMenuComponent, PaneFormComponent]
})
export class TestBehavioursUiModule { }
