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
    constructor(private characterService: CharacterService) {}
    ngOnInit() {
        this.characterService.initCharacters();
    }

}