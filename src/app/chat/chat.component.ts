import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as io from 'socket.io-client';

import { ChatUser } from './chat-user.module';
import { ChatMessage } from './chat-message.model';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    private socket;
    public users: ChatUser[] = [];
    public messages: ChatMessage[] = [];
    public chatForm: FormGroup;

    ngOnInit() {
        this.chatForm = new FormGroup({
            message: new FormControl(null, Validators.required)
        });
        this.messages.push(new ChatMessage('Never reveal your password or any sensitive information', 'Roctaya Admin'));
        if (localStorage.getItem('token')) {
            this.socket = io('https://roctaya.herokuapp.com', {
                query: 'token=' + localStorage.getItem('token')
            });
            this.socket.on('users', (data) => {
                const usersArray = data.users;
                for(let i = 0; i < usersArray.length; i++){
                    this.users.push(new ChatUser(usersArray[i].id,usersArray[i].nickname));
                }
            });
            this.socket.on('newUser', (data) =>{
                this.users.push(new ChatUser(data.id,data.nickname));
            })
            this.socket.on('message', (data) => {
                this.newMessage(new ChatMessage(data.msg.message, data.msg.sender));
                console.log(data);
            });
            this.socket.on('userDisconnect', (data) => {
                this.userDisconnected(new ChatMessage(data.msg,data.sender));
                console.log(data);
            });
            this.socket.on('disconnected', (data) => {
                localStorage.clear();
                alert('Multiple instanses. Please Sign-in again if you wish to use this browser');
                location.reload();
            });
        }
    }

    /////////////////////////////////////////////////
    //Chat methods

    newMessage(msg: ChatMessage) {
        this.messages.push(msg);
        if (this.messages.length > 50) {
            this.messages.pop();
        }
    }
    sendMessage() {
        if(this.chatForm.value.message == null || this.chatForm.value.message.trim() === '') {
            this.chatForm.reset();
            return;}
        this.socket.emit('message', {
            message: this.chatForm.value.message
        }); 
        this.messages.push(new ChatMessage(this.chatForm.value.message,localStorage.getItem('nickname')));
        this.chatForm.reset();
    }
    userDisconnected(msg: ChatMessage) {
        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].nickname === msg.sender){
                this.users.splice(i,1);
            }
        }
    }

    /////End of chat methods

}