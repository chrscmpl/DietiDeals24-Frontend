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

interface defaultValidationErrorMessage {
    validation: validation | validation[];
    message: string;
}

interface customValidationErrorMessage {
    customValidation: string | string[];
    message: string;
}

export type errorMessage =
    | defaultValidationErrorMessage
    | customValidationErrorMessage;

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
            const validation = this.getValidation(e);
            if (validation === 'all') return true;
            if (Array.isArray(validation)) {
                return validation.some((v) => errorKeys.includes(v));
            }
            return errorKeys.includes(validation);
        });
        return error?.message || this.defaultErrorString;
    }

    private getValidation(errorMessage: errorMessage): string | string[] {
        if ('validation' in errorMessage) return errorMessage.validation;
        if ('customValidation' in errorMessage)
            return errorMessage.customValidation;
        return '';
    }
}
