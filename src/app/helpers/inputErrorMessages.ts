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

export const defaultErrorString = 'Invalid input';
