import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataServicesFactory } from './common/services/data-services/data.factory';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DataServicesFactory
  ],
})
export class TestBehavioursCoreModule { }
