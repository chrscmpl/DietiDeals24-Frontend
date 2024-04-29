import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials, User, UserDTO } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _loggedUser: User | null = null;
    constructor(private http: HttpClient) {}
    public isLogged(): boolean {
        return false;
    }
    public loggedUser(): User | null {
        return this._loggedUser;
    }
    public login(credentials: UserCredentials): Observable<UserDTO> {
        return this.http.post<UserDTO>('dd24-backend/login', credentials).pipe(
            tap((value: UserDTO) => {
                this._loggedUser = new User(value);
                console.log(this._loggedUser);
            })
        );
    }
}
