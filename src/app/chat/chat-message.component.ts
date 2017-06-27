import { Component, Input } from "@angular/core";
import { ChatMessage } from './chat-message.model';

@Component({
    selector: 'chat-message',
    template: `
    <div>
        <p>{{msg.sender}}:<span class="messagebody">{{msg.message}}</span></p>
    </div>
    `,
    styles:[`
        p{
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