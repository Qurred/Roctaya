import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import {User} from './user';

@Injectable()
export class AuthService {
    private user: User;

    constructor(private http: Http) {}

    signup(username: string, nickname: string, password: string){
        const encodable = `${username}:${nickname}:${password}`;
        const encoded = btoa(encodable);
        const headers = new Headers({'Content-Type': 'application/json'});
        const body = {query:encoded};
        this.http.post('http://roctaya.herokuapp.com/api/signup',body,headers)
        .map((res: Response) =>{
            const result = res.json().message;
            console.log(result);
        }).catch((err:Response)=> Observable.throw(err.json()));
    }

    signin(username: string, password: string){
        const encodable = `${username}:${password}`;
        const encoded = btoa(encodable);
        const headers = new Headers({'Content-Type': 'application/json'});
        const body = {query:encoded};
        this.http.post('http://roctaya.herokuapp.com/api/signin',body,headers)
        .map((res:Response) =>{

        }).catch((err:Response)=> Observable.throw(err.json()));


    }

    isSignIn(){
        const currentToken = localStorage.getItem('token');
        if(!currentToken) {return false}
        // Current, need to add api to check
        return true;
    }
}