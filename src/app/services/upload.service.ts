import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    catchError,
    concatMap,
    forkJoin,
    from,
    map,
    Observable,
    Observer,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

import imageCompression from 'browser-image-compression';
import { UploadedFile } from '../models/uploaded-file.model';
import { UploadException } from '../exceptions/upload.exception';
import { GetNextUploadUrlException } from '../exceptions/get-next-upload-url.exception';
import { FileCompressionException } from '../exceptions/file-compression.exception';
import { BACKEND_REQUEST } from '../tokens/generic-request.token';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    private nextUploadUrl: string | null = null;

    private uploadedFileIdCounter = 0;

    private uploadedFileNextId$ = of(null).pipe(
        concatMap(() => {
            return of(this.uploadedFileIdCounter++);
        }),
        take(1),
    );

    constructor(private readonly http: HttpClient) {}

    public prepareNextUploadUrl(cb?: Partial<Observer<string>>): void {
        (this.nextUploadUrl
            ? of(this.nextUploadUrl)
            : this.getNextUploadUrl().pipe(
                  tap((url) => (this.nextUploadUrl = url)),
              )
        ).subscribe(cb);
    }

    public upload(file: File): Observable<UploadedFile> {
        return forkJoin([
            this.getNextUploadUrl(),
            this.compressFile(file),
            this.uploadedFileNextId$,
        ]).pipe(
            take(1),
            switchMap(([url, compressedFile, id]) => {
                this.nextUploadUrl = null;
                const formData = new FormData();
                formData.append('file', compressedFile);
                return this.http
                    .put(url, formData, {
                        context: new HttpContext().set(BACKEND_REQUEST, false),
                    })
                    .pipe(
                        catchError((error) =>
                            throwError(() => new UploadException(error)),
                        ),
                        map(() => ({
                            url,
                            file,
                            id,
                        })),
                    );
            }),
        );
    }

    private getNextUploadUrl(): Observable<string> {
        const nextUploadUrl = this.nextUploadUrl;
        if (nextUploadUrl) {
            this.nextUploadUrl = null;
            return of(nextUploadUrl);
        }
        return this.http
            .get<string>(`upload-url`)
            .pipe(
                catchError((error) =>
                    throwError(() => new GetNextUploadUrlException(error)),
                ),
            );
    }

    private compressFile(file: File): Observable<File> {
        return (
            file.type.startsWith('image/') ? this.compressImage(file) : of(file)
        ).pipe(
            catchError((error) =>
                throwError(() => new FileCompressionException(error)),
            ),
        );
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
