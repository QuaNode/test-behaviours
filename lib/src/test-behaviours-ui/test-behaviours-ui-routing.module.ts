import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './common/components/layout/layout.component';
const routes: Routes = [
  { path: 'custom-route', component: LayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestBehavioursUiRoutingModule {}
