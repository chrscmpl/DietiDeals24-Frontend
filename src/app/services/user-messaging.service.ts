import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { Observable } from 'rxjs';
import { MessageSerializer } from '../serializers/message.serializer';

@Injectable({
    providedIn: 'root',
})
export class UserMessagingService {
    constructor(
        private readonly http: HttpClient,
        private readonly serializer: MessageSerializer,
    ) {}

    public sendMessage(message: Message): Observable<unknown> {
        return this.http.post('message', this.serializer.serialize(message), {
            responseType: 'text',
        });
    }

    public sendReport(message: Message): Observable<unknown> {
        return this.http.post('report', this.serializer.serialize(message), {
            responseType: 'text',
        });
    }
}
