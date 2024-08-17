import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
} from '@angular/forms';

class ReactiveFormsUtils {
    public markAllAsDirty(control: AbstractControl): void {
        if (!control) return;
        if (control instanceof FormControl) control.markAsDirty?.();
        else if (control instanceof FormGroup || control instanceof FormArray)
            this.markGroupOrArrayAsDirty(control);
    }

    private markGroupOrArrayAsDirty(form: FormGroup | FormArray): void {
        if (form instanceof FormGroup)
            for (const controlName of Object.keys(form.controls ?? {})) {
                this.markAllAsDirty(form.get(controlName) as AbstractControl);
            }
        else if (form instanceof FormArray)
            for (const control of form.controls) this.markAllAsDirty(control);
    }
}

export const reactiveFormsUtils = new ReactiveFormsUtils();
