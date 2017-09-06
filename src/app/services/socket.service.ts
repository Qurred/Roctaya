import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';

// This service class is not ready.

@Injectable()
export class SocketService {
    public socket;

    connectSocket() {
        this.socket = io({ query: 'token=' + localStorage.getItem('token') });
        console.log(this.socket);
    }

}