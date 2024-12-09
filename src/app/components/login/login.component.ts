import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Login } from '../../model/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,RouterLink,ReactiveFormsModule,NgIf,NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginDto:Login = new Login();

  showPassword:boolean=false;

  constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: [
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
    if(this.loginForm?.valid){
      this.loginDto.username = this.loginForm.get('email')?.value;
      this.loginDto.password = this.loginForm.get('password')?.value;

      this.userService.loginUser(this.loginDto).subscribe((response)=>{
        // console.log(response)
        if(response.responseCode==401){
          this.router.navigate(['/home']);
        }

        if(response?.['jwtResponse']!=null){
          localStorage.setItem('token',response?.['jwtResponse'].token);
          localStorage.setItem('username',response?.['jwtResponse'].userName);
          localStorage.setItem('role',response?.['jwtResponse'].roles);
          localStorage.setItem('accountNumber',response?.['jwtResponse'].accountNumber);
          this.router.navigate(['/dashboard/user-dashboard']);
        }
      }, (error)=>{
        console.log(error)
      })
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

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Toggle the state
  }
}
