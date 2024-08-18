import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
} from '@angular/forms';

type Mark = 'touched' | 'dirty' | 'pristine' | 'untouched';

class ReactiveFormsUtils {
    public markAllAsTouched(control: AbstractControl): void {
        this.markAllAs(control, 'touched');
    }

    public markAllAsDirty(control: AbstractControl): void {
        this.markAllAs(control, 'dirty');
    }

    public markAllAsPristine(control: AbstractControl): void {
        this.markAllAs(control, 'pristine');
    }

    public markAllAsUntouched(control: AbstractControl): void {
        this.markAllAs(control, 'untouched');
    }

    private markAllAs(control: AbstractControl, markAs: Mark): void {
        if (!control) return;
        if (control instanceof FormControl) this.markAs(control, markAs);
        else if (control instanceof FormGroup || control instanceof FormArray)
            this.markGroupOrArrayAs(control, markAs);
    }

    private markGroupOrArrayAs(
        form: FormGroup | FormArray,
        markAs: Mark,
    ): void {
        if (form instanceof FormGroup)
            for (const controlName of Object.keys(form.controls ?? {})) {
                this.markAllAs(
                    form.get(controlName) as AbstractControl,
                    markAs,
                );
            }
        else if (form instanceof FormArray)
            for (const control of form.controls)
                this.markAllAs(control, markAs);
    }

    private markAs(control: FormControl, markAs: Mark): void {
        switch (markAs) {
            case 'touched':
                control.markAsTouched();
                break;
            case 'dirty':
                control.markAsDirty();
                break;
            case 'pristine':
                control.markAsPristine();
                break;
            case 'untouched':
                control.markAsUntouched();
                break;
        }
    }
}

export const reactiveFormsUtils = new ReactiveFormsUtils();
