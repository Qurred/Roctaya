import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { NewsComponent } from './news/news.component';
import { NewsListComponent } from './news/news-list.component';
import { AuthService } from './auth/auth.service';
import { ChatComponent }from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    NewsListComponent,
    NewsComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
