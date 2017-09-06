import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Character } from "./../character/character";

/* Service that holds metadate and other needed information*/

@Injectable()
export class CharacterService {
    public characters: Character[] = []
    public team: Character[] = [];
    constructor(private http: Http) { }

    initCharacters() {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        });
        this.http.get('https://roctaya.herokuapp.com/api/characters', { headers: headers })
            .map((res: Response) => {
                const listOfCharacters = res.json();
                for (let i = 0; i < listOfCharacters.length; i++) {
                    this.characters.push(new Character(
                        parseInt(listOfCharacters[i].id),
                        listOfCharacters[i].name,
                        listOfCharacters[i].story,
                        null, //Because we currently dont have anything to model skills
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

    getCharacters() {
        return this.characters;
    }

    updateCharacter(id: number, xp: number) {
        for (let i = 0; i < this.characters.length; i++) {
            if (this.characters[i].id === id) {
                this.characters[i].xp += xp;
            }
        }
    }

    addToTeam(c: Character) {
        if (this.team.indexOf(c) === -1) {
            if (this.team.length < 4) {
                this.team.push(c);
                console.log(this.team.length);
            }
        } else {
            this.team.splice(this.team.indexOf(c), 1);
            console.log(this.team.length);
        }
    }

    isSelected(c: Character) {
        return this.team.indexOf(c) !== -1;
    }
}