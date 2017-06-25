import {Component, OnInit} from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import {News} from './news'


@Component({
    selector: 'news-list',
    template:`
    <div>
        <app-news
        [news]="tmp"
        *ngFor="let tmp of news"></app-news>
    </div>
    `
})
export class NewsListComponent implements OnInit{
    private news: News[] = [];
    constructor(private http: Http) {}
    ngOnInit(){
        let tmp = this.http.get('http://roctaya.herokuapp.com/api/news')
        .map((res: Response) =>{
            const newsList = res.json().news;
            console.log(res.json());
            for(let msg of newsList){
                this.news.push(new News(msg.creator,msg.title,msg.body,msg.time));
            }
            console.log(this.news);
        })
        .catch((error: Response) => Observable.throw(error.json()))
        .subscribe();
    }


}