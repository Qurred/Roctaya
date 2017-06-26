import { Component, Input } from "@angular/core";
import { ChatMessage } from './chat-message.model';

@Component({
    selector: 'chat-message',
    template: `
    <div>
        <p>{{msg.message}}</p>
        <p>{{msg.sender}}</p>
    </div>
    `
})
export class ChatMessageComponent {
    @Input() msg: ChatMessage;

}