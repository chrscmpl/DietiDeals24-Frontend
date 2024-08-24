import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { take } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'dd24-pictures-uploader',
    standalone: true,
    imports: [FileUploadModule],
    templateUrl: './pictures-uploader.component.html',
    styleUrl: './pictures-uploader.component.scss',
})
export class PicturesUploaderComponent implements OnInit {
    @Input({ required: true }) public controlName!: string;
    @Input({ required: true }) public maxPictures!: number;
    @Input({ required: true }) public maxSize!: number;

    public control!: FormControl<string[] | null>;

    public uploadUrl: string | null = null;

    public constructor(
        private readonly controlContainer: ControlContainer,
        private readonly upload: UploadService,
    ) {}

    public ngOnInit(): void {
        this.setControl();
        if (this.control.value === null) this.control.setValue([]);

        if (this.control.value?.length !== this.maxSize)
            this.getNextUploadUrl();
    }

    private getNextUploadUrl(): void {
        this.upload
            .getUploadUrl()
            .pipe(take(1))
            .subscribe((url) => {
                this.uploadUrl = url;
            });
    }

    private setControl(): void {
        this.control = this.controlContainer.control?.get(
            this.controlName,
        ) as FormControl;
        if (!this.control) throw new Error('No FormControl provided');
    }
}
