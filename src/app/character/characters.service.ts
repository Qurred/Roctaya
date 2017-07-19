import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs"; // Make imports better, import just submodule

import { Character } from "./character";

/* Service that holds metadate and other needed information*/

@Injectable()
export class CharacterService {
    constructor(private http: Http) {}
    public chatacters: CharacterService[] = []

    initCharacters(){
        const headers = new Headers({
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        });
        
        this.http.get('https://roctaya.herokuapp.com/api/characters',{headers: headers})
        .map((res: Response) =>{
            console.log(res);
        })
        .catch((error: Response) => Observable.throw(error.json()))
        .subscribe();
    }

    updateCharacter(id: number, xp: number){
        
    }
}