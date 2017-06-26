import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';

import { User } from './../auth/user';
import { ChatMessage } from './chat-message.model';
@Component({
    selector: 'chat-app',
    templateUrl:'./chat.component.html'
    
})
export class ChatComponent implements OnInit{
    private socket;
    private users: User[] = [];
    private messages: ChatMessage[] = [];

    //TODO Remove Console.logs when debugging is done
    ngOnInit(){
        if(localStorage.getItem('token')){
            this.socket = io('', {
                query: 'token='+localStorage.getItem('token')
            });
            this.socket.on('users', (data)=>{
                //for of loop to add new users
                console.log(data);
            });
            this.socket.on('message', (data) =>{
                this.newMessage(new ChatMessage('',''));
                console.log(data);
            });
            this.socket.on('userDisconnect',(data)=>{
                this.userDisconnected();
                console.log(data);
            });
            this.socket.on('disconnected',(data)=>{
                console.log(data);
            });
        }else{
            console.log('No token, Please sign-in');
        }
    }

  newMessage(msg: ChatMessage){
    console.log(msg);
  }  
  sendMessage(msg: ChatMessage){
    console.log(msg);
  }

  userDisconnected(){
    console.log('user left!');
  }
  newUser(){
    console.log('new user!');
  }    
}