import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './../auth.service';
import { User } from '../user.module';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html'
})
export class SignUpComponent implements OnInit {
    signupForm: FormGroup;
    constructor(private authService: AuthService) { }

    ngOnInit(){
        this.signupForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            nickname: new FormControl(null, Validators.required),
            // email: new FormControl(null, [
            //     Validators.required,
            //     Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            // ]), //No need for email?
            password: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(20)]),
            passwordRepeat: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(20)])
        });
    }

    signUp(){
        
    }
    // passwordValidator(fg: FormGroup){
    //     if(fg.value.password === fg.value.passwordRepeat){
    //         return null;
    //     }
    //     return true;
    // }
}