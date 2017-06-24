import {Component} from '@angular/core';
import {User} from '../user';

@Component({
    selector: 'signin',
    template:`
    <h2>Sign-in</h2>
    <h3>Username</h3>
    <input #username>
    <h3>Password</h3>
    <input #password>
    <button (click)="signIn()">Sign-in</button>
    `
})
export class SigninComponent {

    signIn(){
        console.log('Signin!');
    }

}