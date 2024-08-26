import { HttpErrorResponse } from '@angular/common/http';

export class HttpException {
    public readonly error: HttpErrorResponse;

    public constructor(error: HttpErrorResponse) {
        this.error = error;
    }
}
