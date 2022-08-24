import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function dateValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (control.value > matchingControl.value) {
            matchingControl.setErrors({ dateValid: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}