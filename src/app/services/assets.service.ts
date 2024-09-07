/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_REQUEST } from '../tokens/generic-request.token';

@Injectable({
    providedIn: 'root',
})
export class AssetsService {
    private static readonly ASSETS_PATH = 'assets';

    constructor(private readonly http: HttpClient) {}

    public getPlainText(fileName: string): Observable<string> {
        return this.http.get(`${AssetsService.ASSETS_PATH}/${fileName}`, {
            responseType: 'text',
            ...this.getOptions(),
        });
    }

    public getJsonObject(fileName: string): Observable<{ [key: string]: any }> {
        return this.http.get(
            `${AssetsService.ASSETS_PATH}/${fileName}`,
            this.getOptions(),
        );
    }

    public getJsonArray(fileName: string): Observable<any[]> {
        return this.http.get(
            `${AssetsService.ASSETS_PATH}/${fileName}`,
            this.getOptions(),
        ) as Observable<any[]>;
    }

    private getOptions() {
        return {
            context: new HttpContext().set(BACKEND_REQUEST, false),
        };
    }
}
