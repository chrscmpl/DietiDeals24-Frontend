import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSummary } from '../models/user.model';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { UserSummaryDTO } from '../DTOs/user.dto';
import { Cacheable } from 'ts-cacheable';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private readonly http: HttpClient) {}

    @Cacheable({ maxCacheCount: 16 })
    public getSummary(id: string): Observable<UserSummary> {
        return this.http
            .get<UserSummaryDTO>(
                `${environment.backendHost}/profile/public-view`,
                { params: { id } },
            )
            .pipe(map((dto) => new UserSummary(dto)));
    }
}
