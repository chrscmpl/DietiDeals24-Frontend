import { HttpErrorResponse } from '@angular/common/http';
import { HttpException } from './http.exception';

export class DeletePaymentMethodException extends HttpException {
    public constructor(error: HttpErrorResponse) {
        super(error);
    }
}
