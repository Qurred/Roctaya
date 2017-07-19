import { Skill } from './skill';

export class Character{
    constructor(
        public id: number,
        public name: String,
        public story: String,
        public skills: Skill[],
        public avatarURL: String
    ){

    }


}