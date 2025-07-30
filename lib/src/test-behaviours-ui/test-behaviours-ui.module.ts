import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { BehaviourDetailsComponent } from './common/components/behaviour-details/behaviour-details.component';
import { DropDownDirective } from './common/directives/drop-down.directive';
import { LayoutComponent } from './common/components/layout/layout.component';
import { ParametersAndReturnsComponent } from './common/components/Parameters-And-Returns/prameters-and-returns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './common/components/header/header.component';
import { TestBehavioursUiRoutingModule } from './test-behaviours-ui-routing.module';
import { VersionFormatPipe } from './common/pipe/format-version.pipe';
import { StringifyPipe } from './common/pipe/stringify.pipe';
// import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FooterComponent } from './common/components/footer/footer.component';
import {
  TestBehavioursUiConfig,
  TEST_BEHAVIOURS_UI_CONFIG,
} from './config/test-behaviours-ui-config';
@NgModule({
  declarations: [
    SideMenuComponent,
    BehaviourDetailsComponent,
    DropDownDirective,
    ParametersAndReturnsComponent,
    LayoutComponent,
    HeaderComponent,
    VersionFormatPipe,
    StringifyPipe,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TestBehavioursUiRoutingModule,
    ReactiveFormsModule,
    // NgxJsonViewerModule,
  ],
  exports: [LayoutComponent, HeaderComponent, StringifyPipe],
})
export class TestBehavioursUiModule {
  static config(
    config: TestBehavioursUiConfig
  ): ModuleWithProviders<TestBehavioursUiModule> {
    return {
      ngModule: TestBehavioursUiModule,
      providers: [{ provide: TEST_BEHAVIOURS_UI_CONFIG, useValue: config }],
    };
  }
}
