import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { FormPaneComponent } from './common/components/form-pane/form-pane.component';
import { DropDownDirective } from './common/directives/drop-down.directive';
import { LayoutComponent } from './common/components/layout/layout.component';
import { ParametersAndReturnsComponent } from './common/components/Parameters-And-Returns/prameters-and-returns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './common/components/header/header.component';
import { TestBehavioursUiRoutingModule } from './test-behaviours-ui-routing.module';
import { VersionFormatPipe } from './common/pipe/format-version.pipe';
import { StringifyPipe } from './common/pipe/stringify.pipe';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  declarations: [
    SideMenuComponent,
    FormPaneComponent,
    DropDownDirective,
    ParametersAndReturnsComponent,
    LayoutComponent,
    HeaderComponent,
    VersionFormatPipe,
    StringifyPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TestBehavioursUiRoutingModule,
    ReactiveFormsModule,
    NgxJsonViewerModule,
  ],
  exports: [LayoutComponent, HeaderComponent, StringifyPipe],
})
export class TestBehavioursUiModule {}
