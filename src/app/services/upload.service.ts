import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, map, Observable, Observer, of, take, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import imageCompression from 'browser-image-compression';
import { UploadedFile } from '../models/uploaded-file.model';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    private nextUploadUrl: string | null = null;

    constructor(private readonly http: HttpClient) {}

    public prepareNextUploadUrl(cb?: Partial<Observer<string>>): void {
        this.getNextUploadUrl().subscribe(cb);
    }

    public upload(file: File, cb?: Partial<Observer<UploadedFile>>): void {
        forkJoin([this.getNextUploadUrl(), this.compressFile(file)])
            .pipe(take(1))
            .subscribe({
                next: ([url, file]) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    this.http
                        .put(url, formData)
                        .pipe(
                            map(() => ({
                                url,
                                file,
                            })),
                        )
                        .subscribe(cb);
                },
                error: cb?.error,
            });
    }

    private getNextUploadUrl(): Observable<string> {
        return this.nextUploadUrl
            ? of(this.nextUploadUrl)
            : this.http
                  .get<string>(`${environment.backendHost}/upload-url`)
                  .pipe(tap((url) => (this.nextUploadUrl = url)));
    }

    private compressFile(file: File): Observable<File> {
        if (!file.type.startsWith('image/')) return of(file);

        return this.compressImage(file);
    }

    private compressImage(file: File): Observable<File> {
        return from(
            imageCompression(file, {
                useWebWorker: true,
                fileType: 'image/webp',
            }),
        ).pipe(
            map((file) => {
                const newName =
                    file.name.substring(0, file.name.lastIndexOf('.')) +
                    '.webp';

                return new File([file], newName, {
                    type: 'image/webp',
                });
            }),
        );
    }
}
