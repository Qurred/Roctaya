import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent {
    constructor(private authService: AuthService) { }

    ngOnInit() {
        if (localStorage.getItem('token')) {
            this.authService.isSignIn();
        }else{
            //homehting..+?
        }
    }

    logout(){
        this.authService.logout();
    }

}