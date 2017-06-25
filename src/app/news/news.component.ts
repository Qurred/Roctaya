import { Component, Input } from "@angular/core";
import {News} from './news';

@Component({
    selector: 'app-message',
    templateUrl: './news.component.html'
})
export class NewsComponent{
    @Input() news: News;

}