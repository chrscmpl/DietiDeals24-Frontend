import { AbstractControl } from '@angular/forms';

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

export class inputErrorMessagesManager {
    private defaultErrorString = 'Invalid input';

    private control: AbstractControl;
    private errors: errorMessage[];

    public constructor({
        control,
        errors,
    }: {
        control: AbstractControl;
        errors: errorMessage[];
    }) {
        this.control = control;
        this.errors = errors;
    }

    public getErrorMessage(): string {
        const ControlErrors = this.control.errors;
        if (!ControlErrors) return '';
        const errorKeys = Object.keys(ControlErrors);
        const error = this.errors.find((e) => {
            if (e.validation === 'all') return true;
            if (Array.isArray(e.validation)) {
                return e.validation.some((v) => errorKeys.includes(v));
            }
            return errorKeys.includes(e.validation);
        });
        return error?.message || this.defaultErrorString;
    }
}
