import { Component, OnInit } from '@angular/core';
 import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Roctaya!';
  info = 'Roctaya is a free turn-based online browser game. This game is a course project, so there is no gurantee that this game will be playable tomorrow. Due this project being a course project there is bugs and the security isn\'t best.';
  // loggedin: boolean = false;

  constructor(public authService: AuthService) { }

  ngOnInit(){
    this.authService.isSignIn();
    // this.loggedin = this.authService.loggedIn;
  }
}
