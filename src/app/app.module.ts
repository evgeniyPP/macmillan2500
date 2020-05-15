import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

import { TestComponent } from './test/test.component';
import { CardsComponent } from './cards/cards.component';
import { FinishedComponent } from './finished/finished.component';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    TestComponent,
    CardsComponent,
    FinishedComponent,
    LayoutComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    RouterModule.forRoot([
      { path: 'finished', component: FinishedComponent, pathMatch: 'full' },
      { path: '**', component: TestComponent },
    ]),
  ],
  providers: [],
  bootstrap: [LayoutComponent],
})
export class AppModule {}
