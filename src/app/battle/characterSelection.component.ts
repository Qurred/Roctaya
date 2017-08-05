import { Component, OnInit } from "@angular/core";
import { CharacterService } from "./../services/characters.service";
import { Character } from './../character/character';

@Component({
    selector:'app-character-selection',
    templateUrl: './characterSelection.component.html',
    styleUrls: ['./characterSelection.component.css']
})
export class CharacterSelectionComponent{
    public selectedCharacters: Character[] = [];
    public myCharacters: Character[] = [];

    constructor(private characterService:CharacterService){}

    ngOnInit(){
        this.myCharacters = this.characterService.characters;
    }

    addToSelection(c:Character){
        if(this.selectedCharacters.indexOf(c) === -1){
            if(this.selectedCharacters.length < 4){
                this.selectedCharacters.push(c);
                console.log('pläääääääh...');
            }
        }
    }
}