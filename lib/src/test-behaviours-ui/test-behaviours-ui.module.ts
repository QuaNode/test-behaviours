import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { FormPaneComponent } from './common/components/form-pane/form-pane.component';
import { DropDownDirective } from './common/directives/drop-down.directive';
import { LayoutComponent } from './common/components/layout/layout.component';
import { JsonTextAreaComponent } from './common/components/json-text-area/json-text-area.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './common/components/header/header.component';
import { TestBehavioursUiRoutingModule } from './test-behaviours-ui-routing.module';
import { VersionFormatPipe } from './common/pipe/format-version.pipe';

@NgModule({
  declarations: [
    SideMenuComponent,
    FormPaneComponent,
    DropDownDirective,
    JsonTextAreaComponent,
    LayoutComponent,
    HeaderComponent,
    VersionFormatPipe
  ],
  imports: [CommonModule, FormsModule,TestBehavioursUiRoutingModule],
  exports: [LayoutComponent,HeaderComponent],
})
export class TestBehavioursUiModule {}
