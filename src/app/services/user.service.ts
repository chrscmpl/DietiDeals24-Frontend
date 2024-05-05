import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials, User, UserDTO } from '../models/user.model';
import {
    Observable,
    ReplaySubject,
    catchError,
    map,
    startWith,
    tap,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private loggedUserSubject = new ReplaySubject<User | null>(1);

    constructor(private http: HttpClient) {
        this.loggedUserSubject.next(null);
    }

    public loggedUser$: Observable<User | null> =
        this.loggedUserSubject.asObservable();

    public isLogged$: Observable<boolean> = this.loggedUser$.pipe(
        map((user) => user !== null),
    );

    public login(credentials: UserCredentials): Observable<User> {
        return this.http.post<UserDTO>('dd24-backend/login', credentials).pipe(
            map((dto: UserDTO) => new User(dto)),
            tap((user) => this.loggedUserSubject.next(user)),
            catchError((err) => {
                this.loggedUserSubject.next(null);
                throw err;
            }),
        );
    }
}
