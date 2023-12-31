import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestBehavioursUiModule } from '../../lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestBehavioursUiModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
