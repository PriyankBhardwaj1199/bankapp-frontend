// import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// // Custom validator to check if password and confirmPassword are the same
// export function passwordMatchValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const password = control.get('password')?.value;
//     const confirmPassword = control.get('confirmPassword')?.value;

//     console.log("Password: "+password);
//     console.log("Confirm password: "+confirmPassword);
//     console.log(password !== confirmPassword)

//     return password !== confirmPassword
//       ? { passwordMismatch: true }
//       : null;
//   };
// }

import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export function passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  // Check if password and confirmPassword are different
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null; // No error if passwords match
}
