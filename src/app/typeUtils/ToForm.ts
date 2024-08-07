import { FormControl } from '@angular/forms';

export type ToReactiveForm<T> = {
    [K in keyof T]: FormControl<T[K] | null>;
};
