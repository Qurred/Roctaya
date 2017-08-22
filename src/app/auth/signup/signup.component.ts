import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth.service';
import { User } from '../user.module';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
    signupForm: FormGroup;
    @Output() changeView = new EventEmitter();
    constructor(private authService: AuthService) { }

    ngOnInit(){
        this.signupForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            nickname: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(20)]),
            passwordRepeat: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(20)])
        });
    }

    signUp(){
        alert('Sorry! Currently registering new users is disable because of maintaince.');
        
    }
    // passwordValidator(fg: FormGroup){
    //     if(fg.value.password === fg.value.passwordRepeat){
    //         return null;
    //     }
    //     return true;
    // }
    loginShow(){
        this.changeView.emit();
    }
}