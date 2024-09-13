import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserSummary } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { UserDTO, UserSummaryDTO } from '../DTOs/user.dto';
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

    public getSummary(id: string): Observable<UserSummary> {
        return this.getUserDTO(id).pipe(
            map((dto) => this.summaryDeserializer.deserialize(dto)),
        );
    }

    public getUser(id: string): Observable<User> {
        return this.getUserDTO(id).pipe(
            map((dto) => this.userDeserializer.deserialize(dto)),
        );
    }

    @Cacheable({ maxCacheCount: 16 })
    private getUserDTO(id: string): Observable<UserDTO> {
        return this.http.get<UserDTO>(`profile/public-view`, {
            params: { id },
        });
    }
}
