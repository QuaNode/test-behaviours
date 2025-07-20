import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './common/components/layout/layout.component';
import { FormPaneComponent } from './common/components/form-pane/form-pane.component';
const routes: Routes = [
  { path: '', component: FormPaneComponent },
  { path: 'custom-route', component: LayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestBehavioursUiRoutingModule {}
