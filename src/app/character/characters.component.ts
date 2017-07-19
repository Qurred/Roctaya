import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Character } from './character';
import { CharacterService } from "./characters.service";

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrls: ['./characters.component.css']
})
export class CharactersComponent{
    public myCharacters: Character[] = [];
    public selectedCharacter: Character;
    constructor(private characterService: CharacterService) {}
    ngOnInit() {
        this.characterService.initCharacters();
        this.myCharacters = this.characterService.chatacters;
    }

    calcDeg(i:number){
        let style = {
            'transform': `rotate(${i * 20 + 90}deg) translate(12em) rotate(-${i * 20 + 90}deg)`
        }
        return style;
    }

}