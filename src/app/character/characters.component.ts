import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Character } from './character';
import { CharacterService } from './../services/characters.service';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrls: ['./characters.component.css']
})
export class CharactersComponent {
    public myCharacters: Character[] = [];
    public selectedCharacter: Character;
    constructor(private characterService: CharacterService) { }

    ngOnInit() {
        if (!this.characterService.characters || this.characterService.characters.length === 0) {
            this.characterService.initCharacters();
        }
        this.myCharacters = this.characterService.characters;
    }

    setSelectedCharacter(c: Character) {
        this.selectedCharacter = c;
    }

    isSelected(c: Character) {
        if (c === this.selectedCharacter) {
            return true;
        }
        return false;
    }

    calcDeg(i: number) {
        return {
            'transform': `rotate(${i * 25.71 + 90}deg) translate(192px) rotate(-${i * 25.71 + 90}deg)`
        }
    }

    calcLevel() {
        return Math.floor((2 / 9) * Math.sqrt(this.selectedCharacter.xp));
    }

    addtoTeam(c: Character) {
        this.characterService.addToTeam(c);
    }

    isInTeam(c: Character) {
        return this.characterService.isSelected(c);
    }

    updateStat(stat) {
        const scale = 3 / 39;
        return (this.selectedCharacter[stat] +
            Math.floor(this.selectedCharacter[stat] *
                scale * (Math.floor((2 / 9) * Math.sqrt(this.selectedCharacter.xp))))
        );
    }
}
