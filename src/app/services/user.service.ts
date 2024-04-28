import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials, User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _loggedUser?: User;
    constructor(private http: HttpClient) {}
    public isLogged(): boolean {
        return false;
    }
    public loggedUser(): User {
        return {
            username: 'test',
            name: 'test',
            surname: 'test',
            birthday: 'test',
            profilePictureUrl: 'test',
            bio: 'test',
            links: [],
            onlineAuctions: 0,
            pastDeals: 0,
            contactData: [],
        };
    }
    public login(credentials: UserCredentials) {
        this.http
            .post<User>('http://localhost:3000/login', credentials)
            .subscribe((value: User) => {
                this._loggedUser = value;
            });
    }
}
