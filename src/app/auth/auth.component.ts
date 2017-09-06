import { Component } from "@angular/core";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {

    public showLogin: Boolean = true;
    constructor() { }

    changeView() {
        this.showLogin = !this.showLogin;
    }
}