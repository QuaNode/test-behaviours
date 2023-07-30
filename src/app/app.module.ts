import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestBehavioursUiModule } from '../../lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TestBehavioursCoreModule } from 'lib/src/test-behaviours-ui/test-behaviours-core.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestBehavioursCoreModule,
    TestBehavioursUiModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
