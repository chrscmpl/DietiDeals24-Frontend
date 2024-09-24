import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import { NotificationDTO } from '../dtos/notification.dto';
import {
    Notification,
    NotificationConstructors,
    NotificationType,
} from '../models/notification.model';
import { AuctionDeserializer } from './auction.deserializer';

@Injectable({
    providedIn: 'root',
})
export class NotificationDeserializer
    implements Deserializer<NotificationDTO, Notification>
{
    constructor(private readonly auctionDeserializer: AuctionDeserializer) {}

    public deserialize(dto: NotificationDTO): Notification {
        const constructor = NotificationConstructors.get(
            dto.notificationType as NotificationType,
        );
        if (!constructor) throw new Error('Invalid notification DTO');
        const notification = new constructor(dto);

        if (dto.auction) {
            notification.auction = this.auctionDeserializer.deserialize(
                dto.auction,
            );
        }

        return notification;
    }

    public deserializeArray(dtos: NotificationDTO[]): Notification[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
