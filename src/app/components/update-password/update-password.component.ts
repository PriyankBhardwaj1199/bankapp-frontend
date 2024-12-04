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
  showPassword: boolean = false;


  updateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.updateForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required,this.accountNumberValidator,Validators.minLength(12),Validators.maxLength(12)]],
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

    // Rule 4: At least one lowercase letter
    if (!/[a-z]/.test(value)) {
      errors['noLowerCase'] = 'Password must contain at least one lowercase letter';
    }

    // Rule 1: At least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      errors['noUpperCase'] = 'Password must contain at least one uppercase letter';
    }

    return Object.keys(errors).length ? errors : null;
  }

  accountNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    const errors: ValidationErrors = {};
    
    // Rule 1: First 2 characters should be letters
    if (!/^[A-Za-z]{2}/.test(value)) {
      errors['noLetterStarting'] = 'First two letters of the account number should be alphabets';
    }

    // Rule 2: 10 digits
    if (!/\d{10}$/.test(value)) {
      errors['noTenDigit'] = 'Account number must contain 10 digits';
    }


    return Object.keys(errors).length ? errors : null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Toggle the state
  }

}
