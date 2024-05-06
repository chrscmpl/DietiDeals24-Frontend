import { NgControl } from '@angular/forms';

type validation =
    | 'required'
    | 'email'
    | 'min'
    | 'max'
    | 'pattern'
    | 'minlength'
    | 'maxlength'
    | 'all';

export interface errorMessage {
    validation: validation | validation[];
    message: string;
}

class inputErrorMessagesManager {
    private defaultErrorString = 'Invalid input';

    public getErrorMessage(
        control: NgControl,
        errorMessages: errorMessage[],
    ): string {
        const ControlErrors = control.errors;
        if (!ControlErrors) return '';
        const errorKeys = Object.keys(ControlErrors);
        const error = errorMessages.find((e) => {
            if (e.validation === 'all') return true;
            if (Array.isArray(e.validation)) {
                return e.validation.some((v) => errorKeys.includes(v));
            }
            return errorKeys.includes(e.validation);
        });
        return error?.message || this.defaultErrorString;
    }
}

export const ErrorMessagesManager = new inputErrorMessagesManager();
