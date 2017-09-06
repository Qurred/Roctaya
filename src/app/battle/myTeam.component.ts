import { Component, OnInit } from '@angular/core';
import { CharacterService } from './../services/characters.service';
import { Character } from './../character/character';

@Component({
    selector: 'app-my-team',
    templateUrl: './myTeam.component.html',
    styleUrls: ['./myTeam.component.css']
})
export class MyTeamComponent {
    public selectedCharacters: Character[] = [];
    public myTeam: Character[] = [];

    constructor(private characterService: CharacterService) { }

    ngOnInit() {
        this.myTeam = this.characterService.getCharacters();
    }
    setBackground(c: Character) {
        const style = {
            'background-image': `url(\'/assets/characters/${c.avatar}')`
        };
        return style;
    }
}
