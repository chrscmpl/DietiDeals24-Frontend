import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserSummary } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { UserDTO } from '../DTOs/user.dto';
import { Cacheable } from 'ts-cacheable';
import { UserDeserializer } from '../deserializers/user.deserializer';
import { UserSummaryDeserializer } from '../deserializers/user-summary.deserializer';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private readonly http: HttpClient,
        private readonly summaryDeserializer: UserSummaryDeserializer,
        private readonly userDeserializer: UserDeserializer,
    ) {}

    @Cacheable({ maxCacheCount: 16 })
    public getSummary(id: string): Observable<UserSummary> {
        return this.http
            .get<UserDTO>(`profile/minimal-view`, {
                params: { id },
            })
            .pipe(map((dto) => this.summaryDeserializer.deserialize(dto)));
    }

    @Cacheable({ maxCacheCount: 16 })
    public getUser(id: string): Observable<User> {
        return this.http
            .get<UserDTO>(`profile/public-view`, {
                params: { id },
            })
            .pipe(map((dto) => this.userDeserializer.deserialize(dto)));
    }
}
