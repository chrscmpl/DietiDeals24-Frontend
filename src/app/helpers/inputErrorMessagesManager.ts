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

export type errorMessage = {
    validation?: validation | validation[];
    customValidation?: string | string[];
    message: string;
};

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
        return errorMessage.validation ?? errorMessage.customValidation ?? [];
    }
}
