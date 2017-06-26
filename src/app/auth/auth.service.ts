import { Injectable/*, EventEmitter*/ } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from './user';

@Injectable()
export class AuthService {
    private user: User;

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
    }

    isSignIn(){
        const currentToken = localStorage.getItem('token');
        if(!currentToken) {return false}
        // Current, need to add api to check
        return true;
    }
}