import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MentionlistComponent } from './mentionlist/mentionlist.component';
import { TrendingComponent } from './trending/trending.component';
import { UserMentionsComponent } from './user-mentions/user-mentions.component';

@NgModule({
  declarations: [
    AppComponent,
    MentionlistComponent,
    TrendingComponent,
    UserMentionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
