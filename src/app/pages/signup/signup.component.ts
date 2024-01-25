import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HttpClientModule, FormsModule],
  templateUrl: './signup.component.html',
  providers: [ApiService],
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  loadingSpinner: boolean = false;
  emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  userData: any = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private apiService: ApiService, public alertService: AlertService) {}

  signup() {
    var accept_tou = (document.getElementById('registerAcceptToU') as HTMLInputElement).checked;

    if (!accept_tou) {
      this.alertService.show("error", "Please accept the Terms of Use")
      return
    }

    if (this.userData.first_name.length < 1) {
      this.alertService.show("error", "Please fill in the first name")
      return
    }

    if (this.userData.last_name.length < 1) {
      this.alertService.show("error", "Please fill in the last name")
      return
    }

    if (this.userData.username.length < 5) {
      this.alertService.show("error", "Please use at least 5 characters for the username")
      return
    }

    if (this.userData.email.length < 1) {
      this.alertService.show("error", "Please fill in a real email")
      return
    }

    if (this.userData.password.length < 8) {
      this.alertService.show("error", "Please use at least 8 characters for the password")
      return
    }

    if (this.userData.password != this.userData.confirmPassword) {
      this.alertService.show("error", "Password do not match")
      return
    }

    if (!this.emailPattern.test(this.userData.email)) {
      this.alertService.show("error", "Invalid email address")
      return
    }

    
    
    
    this.loadingSpinner = true;
    document.getElementById('signupButton')?.classList.add("btn-disabled")

    this.apiService.signup(this.userData).subscribe(
      (response) => {
        console.log(response);
        this.loadingSpinner = false;
        document.getElementById('signupButton')?.classList.remove("btn-disabled")
        this.alertService.show("success", "Sign up was successfull")
      },
      (error) => {
        console.log(error);
        this.loadingSpinner = false;
        document.getElementById('signupButton')?.classList.remove("btn-disabled")
        this.alertService.show("error", "There was an error")
      }
    );
  }

}
