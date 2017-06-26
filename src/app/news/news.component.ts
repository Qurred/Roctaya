import { Component, Input } from "@angular/core";
import {News} from './news';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent{
    @Input() news: News;

}