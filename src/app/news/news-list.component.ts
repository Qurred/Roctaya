import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { News } from './news'


@Component({
    selector: 'app-news-list',
    template: `
        <app-news
        [news]="tmp"
        *ngFor="let tmp of news"></app-news>
    `
})
export class NewsListComponent implements OnInit {
    private offset: number;
    public news: News[] = [];
    constructor(private http: Http) { }
    ngOnInit() {
        const tmp = this.http.get('https://roctaya.herokuapp.com/api/news')
            .map((res: Response) => {
                const result = res.json();
                this.offset = result.offset;
                const newsList = result.news;
                for (const msg of newsList) {
                    this.news.push(new News(msg.creator, msg.title, msg.body, msg.time, msg.banner));
                }
            })
            .catch((error: Response) => Observable.throw(error.json()))
            .subscribe();
    }
}