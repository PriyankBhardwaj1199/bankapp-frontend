import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent,NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  showAlert=false;
  showAlertConfirm=false;

  showPassword: boolean = false; // Variable to track the checkbox state

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Toggle the state
  }

}
