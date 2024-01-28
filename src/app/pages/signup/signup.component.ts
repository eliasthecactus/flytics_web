import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
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

  constructor(private apiService: ApiService, public alertService: AlertService, private router: Router) {}

  checkAvailability(username: string) {
    var available = document.getElementById('usernameAvailable')
    var notAvailable = document.getElementById('usernameNotAvailable')
    if (username.length > 4) {
      this.apiService.availabilityCheck(username).subscribe(
        (response) => {
          if (response.code == 0) {
            available?.classList.remove('hidden')
            notAvailable?.classList.add('hidden')
            console.log("check")
          } else if (response.code == 10){
            available?.classList.add('hidden')
            notAvailable?.classList.remove('hidden')
          } else {
            console.log("There was an error")
          }
          // document.getElementById("usernameAvailability")
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      available?.classList.add('hidden')
      notAvailable?.classList.add('hidden')
    }
  }

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
        // console.log(response);
        if (response.code == 0) {
          this.loadingSpinner = false;
          this.router.navigate(['/login']);
        } else {
          this.alertService.show("error", response.message);
        }
      },
      (error) => {
        // console.log(error);
        this.loadingSpinner = false;
        document.getElementById('signupButton')?.classList.remove("btn-disabled")
        this.alertService.show("error", "There was an error")
      }
    );
  }

}
