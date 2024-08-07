import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
} from '@angular/forms';

class ReactiveFormsUtils {
    public markAllAsDirty(form: FormGroup | FormArray): void {
        if (form instanceof FormGroup)
            for (const controlName of Object.keys(form.controls ?? {})) {
                this.markAsDirty(form.get(controlName));
            }
        else if (form instanceof FormArray)
            for (const control of form.controls) this.markAsDirty(control);
    }

    private markAsDirty(control: AbstractControl | null): void {
        if (!control) return;
        if (control instanceof FormControl) control.markAsDirty?.();
        else if (control instanceof FormGroup || control instanceof FormArray)
            this.markAllAsDirty(control);
    }
}

export const reactiveFormsUtils = new ReactiveFormsUtils();
