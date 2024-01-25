import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  providers: [ApiService, CookieService],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loadingSpinner: boolean = false;
  emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  userData: any = {
    email: '',
    password: ''
  };
  

  constructor(private apiService: ApiService, public alertService: AlertService, private cookieService: CookieService, private router: Router) {

  }

  login() {
    this.loadingSpinner = true;
    document.getElementById('loginButton')?.classList.add("btn-disabled")

    this.apiService.login(this.userData).subscribe(
      (response) => {
        // console.log(response);

        this.loadingSpinner = false;
        document.getElementById('loginButton')?.classList.remove("btn-disabled")
        // this.alertService.show("success", "Success")
        if (response.code == 0) {
          this.cookieService.set('token', response.access_token, undefined, '/', undefined, true, 'Lax');
          this.router.navigate(['/dashboard']);
        } else if (response.code == 10) {
          this.alertService.show("error", "Your account is disabled. Please contact us to enable your account")
        } else if (response.code == 20) {
          this.alertService.show("error", "Please activate your account if you wanna use it. A new activation link was sent to your account.")
        } else if (response.code == 30) {
          this.alertService.show("error", "Invalid credentials")
        } else {
          this.alertService.show("error", "Unknown error")
        }
      },
      (error) => {
        console.log(error);
        this.loadingSpinner = false;
        document.getElementById('loginButton')?.classList.remove("btn-disabled")
        this.alertService.show("error", "There was an error while logging in")
      }
    );
  }

}
