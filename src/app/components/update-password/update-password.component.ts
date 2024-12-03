import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [HeaderComponent, NgIf, ReactiveFormsModule,NgClass],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent {
  showAlert: boolean = false;

  updateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.updateForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required,Validators.pattern(/^[A-Za-z]{2}\d{10}$/)]],
      oldPassword: [
        '',
        [
          Validators.required,
          this.passwordValidator,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          this.passwordValidator,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  onSubmit(){
    if(this.updateForm?.valid){
      console.log(this.updateForm.value)
    }
  }
  
  ngOnInit(): void {
    // Subscribe to value changes on the password field
    this.updateForm.get('oldPassword')?.valueChanges.subscribe(() => {
      this.logPasswordErrors();
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    const errors: ValidationErrors = {};
    
    // Rule 1: At least one letter
    if (!/[A-Za-z]/.test(value)) {
      errors['noLetter'] = 'Password must contain at least one letter';
    }

    // Rule 2: At least one number
    if (!/\d/.test(value)) {
      errors['noDigit'] = 'Password must contain at least one number';
    }

    // Rule 3: At least one special character
    if (!/[@$!%*?&]/.test(value)) {
      errors['noSpecialChar'] = 'Password must contain at least one special character';
    }

    return Object.keys(errors).length ? errors : null;
  }

  logPasswordErrors(): void {
    const passwordControl = this.updateForm.get('oldPassword');
    if (passwordControl?.errors) {
      console.log('Password errors:', passwordControl.errors);

      for (const errorKey in passwordControl.errors) {
        if (passwordControl.errors.hasOwnProperty(errorKey)) {
          console.log(`Rule failed: ${errorKey}`);
        }
      }
    }

    
  }
}
