import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AssetsService {
    constructor(private readonly http: HttpClient) {}

    public getPlainText(fileName: string): Observable<string> {
        return this.http.get(`assets/${fileName}`, {
            responseType: 'text',
        });
    }
}
