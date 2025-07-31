import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { BehaviourDetailsComponent } from './common/components/behaviour-details/behaviour-details.component';
import { DropDownDirective } from './common/directives/drop-down.directive';
import { LayoutComponent } from './common/components/layout/layout.component';
import { HeaderComponent } from './common/components/header/header.component';
import { FooterComponent } from './common/components/footer/footer.component';

import { TestBehavioursUiRoutingModule } from './test-behaviours-ui-routing.module';
import { VersionFormatPipe } from './common/pipe/format-version.pipe';
import { StringifyPipe } from './common/pipe/stringify.pipe';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { Behaviours } from 'ng-behaviours';
import {
  TestBehavioursUiConfig,
  TEST_BEHAVIOURS_UI_CONFIG,
} from './config/test-behaviours-ui-config';
import { ParametersAndReturnsComponent } from './common/components/Parameters-And-Returns/prameters-and-returns';
import { RequestsService } from '../test-behaviours-core/services/requests-service/requests.service';

export function getBehaviours(
  http: HttpClient,
  config: TestBehavioursUiConfig
): Behaviours {
  const base = config.baseURL ?? '';
  const baseForURL = base || window.location.origin;
  const fullURL = new URL(
    config.prefix.replace(/^\/+/, ''),
    baseForURL
  ).toString();
  return new Behaviours(http, fullURL);
}

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
    ReactiveFormsModule,
    TestBehavioursUiRoutingModule,
    NgxJsonViewerModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: Behaviours,
      useFactory: getBehaviours,
      deps: [HttpClient, TEST_BEHAVIOURS_UI_CONFIG],
    },
    RequestsService,
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
