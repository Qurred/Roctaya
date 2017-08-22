import { Routes, RouterModule } from "@angular/router";

import { SigninComponent } from './auth/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';

// Holds all the routes
const APP_ROUTES: Routes =[
    {path: '', redirectTo: '/', pathMatch: 'full'},
    {path: '', component: HomeComponent}, // The home component wrapper
    {path: 'game', component: GameComponent}, // This component should be some kind of wrapper for auth and the game
    {path: '**', redirectTo: '/' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
