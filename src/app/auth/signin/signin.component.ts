import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './../auth.service';
import { User } from '../user.module';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {
    signinForm: FormGroup;
    signin: boolean = true;
    constructor(private authService: AuthService) { }

    signIn() {
        this.authService.signin(
            this.signinForm.value.username,
            this.signinForm.value.password
        ).subscribe(
            data => {
                localStorage.setItem("token", data.token);
                localStorage.setItem('nickname', data.nickname);
                localStorage.setItem('_id', data.id);
                this.authService.loggedIn = true;
            },
            err => console.error(err)
        );
        this.signinForm.reset();
    }

    ngOnInit() {
        this.signinForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }
    signupShow(){
        alert('Nope... just testing.... Sorry ;_;');
    }
}