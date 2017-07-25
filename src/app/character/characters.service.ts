import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs"; // Make imports better, import just submodule

import { Character } from "./character";

/* Service that holds metadate and other needed information*/

@Injectable()
export class CharacterService {
    constructor(private http: Http) {}
    public chatacters: Character[] = []

    initCharacters(){
        const headers = new Headers({
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        }); 
        this.http.get('https://roctaya.herokuapp.com/api/characters',{headers: headers})
        .map((res: Response) =>{
            const listOfCharacters = res.json();
            // const listOfCharacters = data.characters;
            // console.log(data);
            for(let i = 0; i < listOfCharacters.length; i++){
               this.chatacters.push(new Character(parseInt(listOfCharacters[i].id),listOfCharacters[i].name,listOfCharacters[i].story,null,listOfCharacters[i].img_path)); 
            }
        })
        .catch((error: Response) => Observable.throw(error.json()))
        .subscribe();
    }

    updateCharacter(id: number, xp: number){
        
    }
}