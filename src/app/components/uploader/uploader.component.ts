import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import {
    FileRemoveEvent,
    FileUpload,
    FileUploadHandlerEvent,
    FileUploadModule,
} from 'primeng/fileupload';
import { last } from 'lodash-es';
import { UploadedFile } from '../../models/uploaded-file.model';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'dd24-uploader',
    standalone: true,
    imports: [FileUploadModule],
    templateUrl: './uploader.component.html',
    styleUrl: './uploader.component.scss',
})
export class UploaderComponent implements OnInit {
    @ViewChild('fileUpload') public fileUploadComponent!: FileUpload;

    @Input({ required: true }) public controlName!: string;
    @Input({ required: true }) public maxFiles!: number;
    @Input({ required: true }) public maxSize!: number;
    @Input() public accept?: string;
    @Input() public dragAndDropMessage: string =
        'Drag and drop your files here';

    public control!: FormControl<UploadedFile[] | null>;

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
    }

    public onUpload(event: FileUploadHandlerEvent): void {
        const file = last(event.files);
        if (!file) return;

        const control = this.control;
        const uploader = this.uploader;
        const message = this.message;
        uploader.upload(file, {
            next: (url) => {
                control.setValue([
                    ...(control.value ?? []),
                    { name: file.name, size: file.size, type: file.type, url },
                ]);
                if (control.value?.length !== this?.maxFiles)
                    uploader.prepareNextUploadUrl();
            },
            error: () => {
                this?.fileUploadComponent?.remove(
                    new Event('click'),
                    event.files.length - 1,
                );
                message.add({
                    severity: 'error',
                    summary: 'Upload failed',
                    detail: 'An error occurred while uploading the file',
                });
            },
        });
    }

    public onRemove(event: FileRemoveEvent): void {
        const file: UploadedFile | undefined = this.control.value?.find(
            (f) => f.name === event.file.name,
        );

        if (!file) return;

        this.removeFile(file);
    }

    public onClear(): void {
        const files = this.control.value;
        if (!files) return;
        for (const file of files) {
            this.removeFile(file);
        }
    }

    private removeFile(file: UploadedFile): void {
        this.http
            .delete(file.url)
            .subscribe(() =>
                this.control.setValue(
                    this.control.value?.filter((f) => f !== file) ?? [],
                ),
            );
    }

    private setControl(): void {
        this.control = this.controlContainer.control?.get(
            this.controlName,
        ) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }
}
