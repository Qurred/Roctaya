import { Component, OnInit } from '@angular/core';
 import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'RocTaYa!';
  info = 'Browser game, WIP   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus, odio at dapibus gravida, enim risus egestas tellus, in ultrices ante quam a velit.Duis nec condimentum sem. Aenean sit amet leo ullamcorper, ultrices neque sit amet, maximus nisl. Proin pulvinar efficitur sapien nec sagittis. In sit ';
  loggedin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(){
    this.authService.isSignIn();
    this.loggedin = this.authService.signedin;
  }

  
}
