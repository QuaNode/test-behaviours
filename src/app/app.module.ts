import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestBehavioursUiModule } from 'lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { environment } from 'lib/src/environment/environment';



@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    TestBehavioursUiModule.config({
      path:  `${environment.path}`,
      baseURL: `${environment.baseURL}`,
      prefix: `${environment.prefix}`
    }),
    FormsModule,
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule { }
