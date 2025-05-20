import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestBehavioursUiModule } from '../../lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Behaviours } from 'ng-behaviours';

export function getBehaviours(http: HttpClient) {
  return new Behaviours(http, 'http://localhost:8383/api/v1');
}

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestBehavioursUiModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: Behaviours,
      useFactory: getBehaviours,
      deps: [HttpClient],
    },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}


