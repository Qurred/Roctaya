import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';

enum STATE {
    main = 0,
    character = 1,
    profile = 2,
    game = 3,
    battle = 4
}

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent {
    public currentState: STATE = STATE.main;
    constructor(private authService: AuthService) { }

    changeState(state: STATE) {
        this.currentState = state;
    }

    ngOnInit() {
        if (localStorage.getItem('token')) {
            this.authService.isSignIn();
        } else {
            //homehting..+?
        }
    }

    logout() {
        this.authService.logout();
    }

}