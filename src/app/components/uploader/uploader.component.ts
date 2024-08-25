import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import {
    FileRemoveEvent,
    FileUpload,
    FileUploadHandlerEvent,
    FileUploadModule,
} from 'primeng/fileupload';
import { compact, last } from 'lodash-es';
import { UploadedFile } from '../../models/uploaded-file.model';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, filter, take } from 'rxjs';

@Component({
    selector: 'dd24-uploader',
    standalone: true,
    imports: [FileUploadModule],
    templateUrl: './uploader.component.html',
    styleUrl: './uploader.component.scss',
})
export class UploaderComponent implements OnInit, OnDestroy {
    @ViewChild('fileUpload') public fileUploadComponent!: FileUpload;

    @Input({ required: true }) public controlName!: string;
    @Input({ required: true }) public maxFiles!: number;
    @Input({ required: true }) public maxSize!: number;
    @Input() public accept?: string;
    @Input() public dragAndDropMessage: string =
        'Drag and drop your files here';

    public control!: FormControl<UploadedFile[] | null>;

    private fileUploading$ = new BehaviorSubject<boolean>(false);

    private fileNotUploading$ = this.fileUploading$.pipe(
        filter((v) => !v),
        take(1),
    );

    public files: File[] = [];

    public constructor(
        private readonly controlContainer: ControlContainer,
        private readonly uploader: UploadService,
        private readonly http: HttpClient,
        private readonly message: MessageService,
    ) {}

    public ngOnInit(): void {
        this.setControl();

        if (this.control.value?.length !== this.maxSize)
            this.uploader.prepareNextUploadUrl();

        if (this.control.value?.length)
            this.files = this.control.value.map((f) => f.file);
    }

    public ngOnDestroy(): void {
        this.fileUploading$.complete();
    }

    public onUpload(event: FileUploadHandlerEvent): void {
        const control = this.control;
        const uploader = this.uploader;
        const message = this.message;

        this.fileNotUploading$.subscribe(() => {
            const files = event.files.filter(
                (f) => !control.value?.some((v) => v.file.name === f.name),
            );

            if (!files.length) return;

            this.fileUploading$.next(true);
            let filesToUpload: number = files.length;

            for (const file of files)
                uploader.upload(file, {
                    next: (uploadedFile) => {
                        const fileIndex = event.files.lastIndexOf(file);
                        control.setValue([
                            ...(control.value?.slice(0, fileIndex) ?? []),
                            uploadedFile,
                            ...(control.value?.slice(fileIndex) ?? []),
                        ]);

                        if (--filesToUpload === 0) {
                            this.control.setValue(compact(this.control.value));
                            if (control.value?.length !== this?.maxFiles)
                                uploader.prepareNextUploadUrl();
                            this?.fileUploading$.next(false);
                        }
                    },
                    error: () => {
                        this?.fileUploadComponent?.remove(
                            new Event('click'),
                            event.files.findIndex((f) => f.name === file.name),
                        );
                        message.add({
                            severity: 'error',
                            summary: 'Upload failed',
                            detail: 'An error occurred while uploading the file',
                        });
                        if (this && --filesToUpload === 0) {
                            this.control.setValue(compact(this.control.value));
                            this.fileUploading$.next(false);
                        }
                    },
                });
        });
    }

    public onRemove(event: FileRemoveEvent): void {
        this.fileNotUploading$.subscribe(() => {
            const file: UploadedFile | undefined = this.control.value?.find(
                (f) => f.file.name === event.file.name,
            );

            if (!file) return;

            this.removeFile(file);
        });
    }

    public onClear(): void {
        this.fileNotUploading$.subscribe(() => {
            const files = this.control.value;
            if (!files) return;
            for (const file of files) {
                this.removeFile(file);
            }
        });
    }

    private removeFile(file: UploadedFile): void {
        const control = this.control;
        const removeFileCb = () =>
            control.setValue(control.value?.filter((f) => f !== file) ?? []);

        this.http.delete(file.url).subscribe({
            next: removeFileCb,
            error: removeFileCb,
        });
    }

    private setControl(): void {
        this.control = this.controlContainer.control?.get(
            this.controlName,
        ) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }
}
