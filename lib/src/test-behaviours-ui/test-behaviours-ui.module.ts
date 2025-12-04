import { NgModule, ModuleWithProviders, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './common/components/side-menu/side-menu.component';
import { BehaviourDetailsComponent } from './common/components/behaviour-details/behaviour-details.component';
import { DropDownDirective } from './common/directives/drop-down.directive';
import { LayoutComponent } from './common/components/layout/layout.component';
import { ParametersAndReturnsComponent } from './common/components/Parameters-And-Returns/parameters-and-returns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './common/components/header/header.component';
import { TestBehavioursUiRoutingModule } from './test-behaviours-ui-routing.module';
import { VersionFormatPipe } from './common/pipe/format-version.pipe';
import { StringifyPipe } from './common/pipe/stringify.pipe';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FooterComponent } from './common/components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Behaviours } from 'ng-behaviours';
import {
  TestBehavioursUiConfig,
  TEST_BEHAVIOURS_UI_CONFIG,
} from './config/test-behaviours-ui-config';

export function getBehaviours(http: HttpClient): Behaviours {
  const config = inject(TEST_BEHAVIOURS_UI_CONFIG);

  if (!config.prefix) {
    throw new Error(
      '[TEST_BEHAVIOURS_UI_CONFIG] prefix is required to create Behaviours URL'
    );
  }

  const base = config.baseURL;
  const prefix = config.prefix;

  let fullURL = prefix;

  if (base) {
    fullURL = new URL(prefix, base).href;
  }

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
  ],
  imports: [
    CommonModule,
    FormsModule,
    TestBehavioursUiRoutingModule,
    ReactiveFormsModule,
    NgxJsonViewerModule,
    FooterComponent,
    HttpClientModule,
    MatTooltipModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: Behaviours,
      useFactory: getBehaviours,
      deps: [HttpClient],
    },
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