import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestBehavioursUiModule } from '../../lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { JsonTextAreaComponent } from './json-text-area/json-text-area.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, JsonTextAreaComponent],
  imports: [BrowserModule, AppRoutingModule, TestBehavioursUiModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
