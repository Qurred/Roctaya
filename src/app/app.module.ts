import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { NewsComponent } from './news/news.component';
import { NewsListComponent } from './news/news-list.component';
import { AuthService } from './services/auth.service';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat/chat-message.component';
import { CharactersComponent } from './character/characters.component';
import { CharacterService } from "./services/characters.service";
import { SocketService } from "./services/socket.service";
import { CharacterSelectionComponent } from "./battle/characterSelection.component";
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { AuthComponent } from './auth/auth.component';

import { routing } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignUpComponent,
    NewsListComponent,
    NewsComponent,
    ChatComponent,
    ChatMessageComponent,
    CharactersComponent,
    CharacterSelectionComponent,
    HomeComponent,
    GameComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    routing
  ],
  providers: [AuthService, CharacterService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
