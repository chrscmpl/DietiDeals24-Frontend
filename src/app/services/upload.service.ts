import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, map, Observable, Observer, of, take, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import imageCompression from 'browser-image-compression';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    private nextUploadUrl: string | null = null;

    constructor(private readonly http: HttpClient) {}

    public prepareNextUploadUrl(cb?: Partial<Observer<string>>): void {
        this.getNextUploadUrl().subscribe(cb);
    }

    public upload(file: File, cb?: Partial<Observer<string>>): void {
        forkJoin([this.getNextUploadUrl(), this.compressFile(file)])
            .pipe(take(1))
            .subscribe({
                next: ([url, compressedFile]) => {
                    const formData = new FormData();
                    formData.append('file', compressedFile);
                    this.http
                        .put(url, formData)
                        .pipe(map(() => url))
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
        return file.type.startsWith('image/')
            ? from(
                  imageCompression(file, {
                      useWebWorker: true,
                      fileType: 'image/webp',
                  }),
              )
            : of(file);
    }
}
