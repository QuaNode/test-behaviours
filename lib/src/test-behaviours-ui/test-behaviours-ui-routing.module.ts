import { NgModule, Inject } from '@angular/core';
import { RouterModule, Routes, ROUTES } from '@angular/router';
import { TEST_BEHAVIOURS_UI_CONFIG } from './config/test-behaviours-ui-config';
import { LayoutComponent } from './common/components/layout/layout.component';

export function routesFactory(config: any): Routes {
  return [
    {
      path: '',
      redirectTo: 'behaviours',
      pathMatch: 'full',
    },
    {
      path: config.defaultRoute,
      component: LayoutComponent,
    },
  ];
}

@NgModule({
  imports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: routesFactory,
      deps: [TEST_BEHAVIOURS_UI_CONFIG],
      multi: true,
    },
  ],
  exports: [RouterModule],
})
export class TestBehavioursUiRoutingModule {}
