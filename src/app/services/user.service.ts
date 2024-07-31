import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSummary } from '../models/user.model';
import { environment } from '../../environments/environment';
import { map, Observable, of } from 'rxjs';
import { UserSummaryDTO } from '../DTOs/user.dto';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private cachedUser: UserSummary | null = null;

    constructor(private readonly http: HttpClient) {}

    public getSummary(id: string): Observable<UserSummary> {
        if (this.cachedUser && this.cachedUser.id === id)
            return of(this.cachedUser);
        return this.http
            .get<UserSummaryDTO>(
                `${environment.backendHost}/profile/public-view`,
                { params: { id } },
            )
            .pipe(map((dto) => (this.cachedUser = new UserSummary(dto))));
    }
}
