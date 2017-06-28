import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from './user.module';

@Injectable()
export class AuthService {
    private user: User; //TODO Check later if useless
    public loggedIn: boolean =  false;   
    constructor(private http: Http) {}

    signup(username: string, nickname: string, password: string){
        const encodable = `${username}:${nickname}:${password}`;
        const encoded = btoa(encodable);
        const headers = new Headers({'Content-Type': 'application/json'});
        const body = JSON.stringify({'query':encoded});
        return this.http.post('https://roctaya.herokuapp.com/api/signup',body,{headers: headers})
        .map((res: Response) =>res.json())
        .catch((err:Response)=> Observable.throw(err.json()));
    }

    signin(username: string, password: string){
        const encodable = `${username}:${password}`;
        const encoded = btoa(encodable);
        const headers = new Headers({'Content-Type': 'application/json'});
        const body = JSON.stringify({query:encoded});
        return this.http.post('https://roctaya.herokuapp.com/api/signin',body,{headers: headers})
        .map((res: Response) =>res.json())
        .catch((err:Response)=> Observable.throw(err.json()));
    }

    logout(){
        localStorage.clear();
        this.loggedIn = false;
    }

    isSignIn(){
        const currentToken = localStorage.getItem('token');
        if(!currentToken) {
            console.log('No token, login');
            this.loggedIn = false;
        }else{      
            if(this.verifyToken()){
                this.loggedIn = true;
            }else{
                localStorage.clear();
            }
        }
    }

    verifyToken(){
        let result = false;
        const headers = new Headers({'Content-Type': 'application/json'});
        this.http.get(`https://roctaya.herokuapp.com/api/verify?token=${localStorage.getItem('token')}`,{headers: headers})
        .map((res:Response)=>{
            result = res.json().valid;
            console.log(result);
            return result;
        })
        .catch((err:Response)=> Observable.throw(err.json()))
        .subscribe();
    }
}