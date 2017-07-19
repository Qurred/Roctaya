import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { NewsComponent } from './news/news.component';
import { NewsListComponent } from './news/news-list.component';
import { AuthService } from './auth/auth.service';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat/chat-message.component';
import { CharactersComponent } from './character/characters.component';
import { CharacterService } from "./character/characters.service";

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignUpComponent,
    NewsListComponent,
    NewsComponent,
    ChatComponent,
    ChatMessageComponent,
    CharactersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, CharacterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
