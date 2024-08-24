import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { last } from 'lodash-es';

@Component({
    selector: 'dd24-uploader',
    standalone: true,
    imports: [FileUploadModule],
    templateUrl: './uploader.component.html',
    styleUrl: './uploader.component.scss',
})
export class UploaderComponent implements OnInit {
    @Input({ required: true }) public controlName!: string;
    @Input({ required: true }) public maxFiles!: number;
    @Input({ required: true }) public maxSize!: number;
    @Input() public accept?: string;
    @Input() public dragAndDropMessage: string =
        'Drag and drop your files here';

    public control!: FormControl<string[] | null>;

    public constructor(
        private readonly controlContainer: ControlContainer,
        private readonly uploader: UploadService,
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
        uploader.upload(file, {
            next: (url) => {
                control.setValue([...(control.value ?? []), url]);
                if (control.value?.length !== this?.maxFiles)
                    uploader.prepareNextUploadUrl();
            },
        });
    }

    private setControl(): void {
        this.control = this.controlContainer.control?.get(
            this.controlName,
        ) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }
}
