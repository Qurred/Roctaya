import {Component, OnInit} from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import {News} from './news'


@Component({
    selector: 'news-list',
    template:`
    <div>
    
    </div>
    `
})
export class NewsListComponent implements OnInit{
    news: News[] = [];
    constructor(private http: Http) {}
    ngOnInit(){
        let tmp = this.http.get('http://roctaya.herokuapp.com/api/news',{'headers': new Headers({'Content-Type': 'application/json'})})
        .map((res: Response) =>{
            console.log(res);
            const newsList = res.json().news;
            console.log(newsList);
        })
        .catch((error: Response) => Observable.throw(error.json()))
        .subscribe();
        console.log('done', tmp);
    }


}