import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {

  loadingSpinner: boolean = false;
  email: String = "";
  password: String = "";
  resetPasswordType: boolean = false;

  constructor(public alertService: AlertService) {}


  sendResetLink() {
    console.log("send a password reset link to mail")
  }

  resetPassword() {
    console.log("reset the password using token")
  }

}
