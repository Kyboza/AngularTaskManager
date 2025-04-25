import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const noWhitespaceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };