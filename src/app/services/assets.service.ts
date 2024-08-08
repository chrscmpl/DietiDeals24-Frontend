/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AssetsService {
    private static readonly ASSETS_PATH = 'assets';

    constructor(private readonly http: HttpClient) {}

    public getPlainText(fileName: string): Observable<string> {
        return this.http.get(`${AssetsService.ASSETS_PATH}/${fileName}`, {
            responseType: 'text',
        });
    }

    public getJsonObject(fileName: string): Observable<{ [key: string]: any }> {
        return this.http.get(`${AssetsService.ASSETS_PATH}/${fileName}`);
    }

    public getJsonArray(fileName: string): Observable<any[]> {
        return this.http.get(
            `${AssetsService.ASSETS_PATH}/${fileName}`,
        ) as Observable<any[]>;
    }
}
