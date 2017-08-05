import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Character } from "./../character/character";

/* Service that holds metadate and other needed information*/

@Injectable()
export class CharacterService {
    constructor(private http: Http) {}
    public characters: Character[] = []

    initCharacters(){
        const headers = new Headers({
            'Content-Type': 'application/json',
            'token':localStorage.getItem('token')
        }); 
        this.http.get('https://roctaya.herokuapp.com/api/characters',{headers: headers})
        .map((res: Response) =>{
            const listOfCharacters = res.json();
            for(let i = 0; i < listOfCharacters.length; i++){
               this.characters.push(new Character(
                   parseInt(listOfCharacters[i].id),
                   listOfCharacters[i].name,
                   listOfCharacters[i].story,
                   null, //Because we currently dont have anything to model skill
                   listOfCharacters[i].img_path,
                   parseInt(listOfCharacters[i].health),
                   parseInt(listOfCharacters[i].mana),
                   parseInt(listOfCharacters[i].defence),
                   parseInt(listOfCharacters[i].speed),
                   parseInt(listOfCharacters[i].attack),
                   parseInt(listOfCharacters[i].intellect),
                   parseInt(listOfCharacters[i].sanity),
                   parseInt(listOfCharacters[i].xp)
                )); 
            }
        })
        .catch((error: Response) => Observable.throw(error.json()))
        .subscribe();
    }

    updateCharacter(id: number, xp: number){
        for(let i = 0; i < this.characters.length; i++){
            if(this.characters[i].id === id){
                this.characters[i].xp += xp;
            }
        }
    }
}