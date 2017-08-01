import { Skill } from './skill';

export class Character{
    constructor(
        public id: number,
        public name: String,
        public story: String,
        public skills: Skill[],
        public avatar: String,
        public health: number,
        public mana: number,
        public defence: number,
        public speed: number,
        public attack: number,
        public intellect: number,
        public sanity: number,
        public xp: number,
        public title?: String
    ){

    }


}