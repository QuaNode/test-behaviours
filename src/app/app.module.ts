import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestBehavioursUiModule } from 'lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Behaviours } from 'ng-behaviours';
import { environment } from 'lib/src/environment/environment';
import { FormsModule } from '@angular/forms';

export function getBehaviours(http: HttpClient) {
  return new Behaviours(http, `${environment.apiUrl}`);
}

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    TestBehavioursUiModule.config({
      defaultRoute: '/custom-route',
      showHeader: true
    }),
    HttpClientModule,
    FormsModule,
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
