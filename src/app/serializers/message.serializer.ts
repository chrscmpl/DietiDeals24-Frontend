import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { MessageDTO } from '../DTOs/message.dto';
import { Message } from '../models/message.model';

@Injectable({
    providedIn: 'root',
})
export class MessageSerializer implements Serializer<Message, MessageDTO> {
    public serialize(data: Message): MessageDTO {
        return data;
    }

    public serializeArray(dataArr: Message[]): MessageDTO[] {
        return dataArr.map((data) => this.serialize(data));
    }
}
