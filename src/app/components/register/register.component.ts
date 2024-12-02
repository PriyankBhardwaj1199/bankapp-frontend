import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  showPassword: boolean = false; // Variable to track the checkbox state

  togglePassword(): void {
    this.showPassword = !this.showPassword; // Toggle the state
  }

}
