import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Character } from './character';
import { CharacterService } from "./../services/characters.service";

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
        this.myCharacters = this.characterService.characters;
    }

    setSelectedCharacter(c: Character){
        this.selectedCharacter = c;
    }

    isSelected(c: Character){
        if(c == this.selectedCharacter){
            return true;
        }
        return false;
    }

    calcDeg(i:number){
        let style = {
            'transform': `rotate(${i * 25.71 + 90}deg) translate(192px) rotate(-${i * 25.71 + 90}deg)`
        }
        return style;
    }

    calcLevel(){
        return Math.floor((2/9) * Math.sqrt(this.selectedCharacter.xp));
    }

    // updateStat(stat){
    //     const scale = 3/39;
    //     console.log(this.selectedCharacter[stat] + Math.floor(this.selectedCharacter[stat]*scale * (Math.floor((2/9) * Math.sqrt(this.selectedCharacter.xp)))));
        
    // }

}