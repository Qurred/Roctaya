import { Component, OnInit } from '@angular/core';
import { CharacterService } from './../services/characters.service';
import { Character } from './../character/character';

@Component({
    selector: 'app-character-selection',
    templateUrl: './characterSelection.component.html',
    styleUrls: ['./characterSelection.component.css']
})
export class CharacterSelectionComponent{
    public selectedCharacters: Character[] = [];
    public myCharacters: Character[] = [];

    constructor(private characterService:CharacterService){}

    ngOnInit(){
        console.log(this.characterService.characters);
        this.myCharacters = this.characterService.getCharacters();
    }

    addToSelection(c: Character){
        if(this.selectedCharacters.indexOf(c) === -1){
            if(this.selectedCharacters.length < 4){
                this.selectedCharacters.push(c);
                console.log(this.selectedCharacters.length);
            }
        }else{
            this.selectedCharacters.splice(this.selectedCharacters.indexOf(c),1);
            console.log(this.selectedCharacters.length);
        }
    }

    isSelected(c: Character){
        return this.selectedCharacters.indexOf(c) !== -1;
    }

    setBackground(c: Character){
        const  style = {
            'background-image': `url(\'./../assets/characters/${c.avatar}')`
        };
        return style;
    }
}
