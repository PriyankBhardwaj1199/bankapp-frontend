import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { NgIf,NgFor, NgClass } from '@angular/common';
import { Country, State } from 'country-state-city';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../utility/custom-validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent,NgIf,NgFor,NgClass,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  
  countries: { name: string; isoCode: string }[] = [];
  states: { name: string; isoCode: string }[] = [];
  defaultStateMessage = 'Select country first';

  registerForm!:FormGroup;
  
  showAlert=false;
  showAlertConfirm=false;

  showPassword: boolean = false; // Variable to track the checkbox state

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
        firstName:['',[Validators.required]],
        middleName:['',],
        lastName:['',[Validators.required]],
        gender:['',[Validators.required]],
        addressLine1:['',[Validators.required]],
        addressLine2:[''],
        city:['',[Validators.required]],
        pinCode:['',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
        stateOfOrigin:['',[Validators.required]],
        country:['',[Validators.required]],
        email:['',[Validators.required,Validators.email]],
        phoneNumber:['',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
        alternativePhoneNumber:['',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
        role:['',[Validators.required]],
        password: [
        '',
        [
          Validators.required,
          this.passwordValidator,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.passwordValidator,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    },
    { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    // Fetch all countries
    this.countries = Country.getAllCountries();
    // this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
    //   console.log(this.registerForm?.hasError('passwordMismatch'))
    // });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Toggle the state
  }

  onSubmit(){
    if(this.registerForm?.valid){
      console.log(this.registerForm.value)
    }
  }

  onCountryChange(): void {
    const selectedCountryIsoCode = this.registerForm.get('country')?.value;
    if (selectedCountryIsoCode) {
      // Fetch states for the selected country
      this.states = State.getStatesOfCountry(selectedCountryIsoCode);
    } else {
      // Reset states if no country is selected
      this.states = [];
    }
    this.registerForm.get('stateOfOrigin')?.setValue(''); // Reset state field
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

  passwordMatcher(control: AbstractControl): ValidationErrors | null {
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

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
  

}
