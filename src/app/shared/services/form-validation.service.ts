import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  getValidationErrors(group: FormGroup, validationMessages: { [key: string]: any }): any {
    let formErrors: { [key: string]: any } = {};

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      formErrors[key] = '';
      if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
      ) {
        const messages = validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        let groupError = this.getValidationErrors(abstractControl, validationMessages);
        formErrors = { ...formErrors, ...groupError };
      }
    });
    return formErrors;
  }

  matchConfirmItems(controlName: string, confirmControlName: string): ValidatorFn {
    // @ts-ignore
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const confirmControl = formGroup.controls[confirmControlName];
      if (!control || !confirmControl) {
        return null;
      }
      // if (confirmControl.errors && !confirmControl.errors.mismatch) {
      //   return null;
      // }
      if (control.value !== confirmControl.value) {
        confirmControl.setErrors({ mismatch: true });
      } else {
        confirmControl.setErrors(null);
      }
    };
  }
}
