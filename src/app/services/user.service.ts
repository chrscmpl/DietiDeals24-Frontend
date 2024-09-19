import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserSummary } from '../models/user.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserDTO } from '../DTOs/user.dto';
import { Cacheable } from 'ts-cacheable';
import { UserDeserializer } from '../deserializers/user.deserializer';
import { UserSummaryDeserializer } from '../deserializers/user-summary.deserializer';
import { GetUserException } from '../exceptions/get-user.exception';

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
            .pipe(
                map((dto) => this.summaryDeserializer.deserialize(dto)),
                catchError((e) => throwError(() => new GetUserException(e))),
            );
    }

    @Cacheable({ maxCacheCount: 16 })
    public getUser(id: string): Observable<User> {
        return this.http
            .get<UserDTO>(`profile/public-view`, {
                params: { id },
            })
            .pipe(
                map((dto) => this.userDeserializer.deserialize(dto)),
                catchError((e) => throwError(() => new GetUserException(e))),
            );
    }
}
