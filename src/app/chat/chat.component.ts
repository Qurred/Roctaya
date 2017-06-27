import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as io from 'socket.io-client';

import { ChatUser } from './chat-user.module';
import { ChatMessage } from './chat-message.model';
@Component({
    selector: 'chat-app',
    templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
    private socket;
    private users: ChatUser[] = [];
    private messages: ChatMessage[] = [];
    private chatForm: FormGroup;

    //TODO Remove Console.logs when debugging is done
    ngOnInit() {
        this.chatForm = new FormGroup({
            message: new FormControl(null, Validators.required)
        });
        this.messages.push(new ChatMessage('Never reveal your password or any sensitive information', 'Roctaya Admin'));
        if (localStorage.getItem('token')) {
            this.socket = io('', {
                query: 'token=' + localStorage.getItem('token')
            });
            this.socket.on('users', (data) => {
                //for of loop to add new users
                console.log(data);
            });
            this.socket.on('message', (data) => {
                this.newMessage(new ChatMessage(data.msg.message, data.msg.sender));
                console.log(data);
            });
            this.socket.on('userDisconnect', (data) => {
                this.userDisconnected(new ChatMessage(data.msg,data.sender));
                console.log(data);
            });
            this.socket.on('disconnected', (data) => {
                console.log(data);
            });
        } else {
            console.log('No token, Please sign-in');
        }
    }

    newMessage(msg: ChatMessage) {
        this.messages.push(msg);
        if (this.messages.length > 50) {
            this.messages.pop();
        }
    }
    sendMessage() {
        this.socket.emit('message', {
            sender: localStorage.getItem('nickname'),
            message: this.chatForm.value.message,
            senderId: localStorage.getItem('_id')
        });
        this.messages.push(new ChatMessage(this.chatForm.value.message,localStorage.getItem('nickname')));
        this.chatForm.reset();
    }

    userDisconnected(msg: ChatMessage) {
        this.messages.push(msg);
        if (this.messages.length > 50) {
            this.messages.pop();
        }
    }
    newUser() {
        console.log('new user!');
    }
}