import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    constructor(private readonly http: HttpClient) {}

    public getUploadUrl(): Observable<string> {
        return this.http.get<string>(`${environment.backendHost}/upload-url`);
    }
}
