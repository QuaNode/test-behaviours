import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//eager loading
//import { LayoutComponent } from 'lib/src/test-behaviours-ui/common/components/layout/layout.component';
const routes: Routes = [
  // {

  //   //lazy loading
  //   path: '',
  //   loadChildren: () =>
  //     import('../../lib/src/test-behaviours-ui/test-behaviours-ui.module').then(
  //       (m) => m.TestBehavioursUiModule
  //     ),
  // },

  // eager loading
  // {path: '', component: LayoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
