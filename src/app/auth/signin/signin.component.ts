import {Component} from '@angular/core';
import {User} from '../user';

@Component({
    selector: 'signin',
    templateUrl:'./signin.component.html'
})
export class SigninComponent {

    signIn(){
        console.log('Signin!');
    }

}