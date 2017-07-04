import { Component, Input } from "@angular/core";
import { ChatMessage } from './chat-message.model';

@Component({
    selector: 'app-chat-message',
    template: `
    <li>
        {{msg.sender}}:<span class="messagebody">{{msg.message}}</span>
    </li>
    `,
    styles:[`
        li{
            color:#009900;
            font-size:20;
        }
        span.messagebody{
            color:#ff00ff;
            font-size:20;
        }
    `]
})
export class ChatMessageComponent {
    @Input() msg: ChatMessage;

}