import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TokenCheckerService } from '../../services/token-checker.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  providers: [ApiService, CookieService, TokenCheckerService],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loadingSpinner: boolean = false;
  emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  userData: any = {
    email: '',
    password: ''
  };
  

  constructor(private apiService: ApiService, public alertService: AlertService, private cookieService: CookieService, private router: Router, private tokenChecker: TokenCheckerService) {

  }

  ngOnInit() {
    this.tokenChecker.redirectToDashboardIfLoggedin();
  }

  

  login() {
    this.loadingSpinner = true;
    document.getElementById('loginButton')?.classList.add("btn-disabled")

    this.apiService.login(this.userData).subscribe(
      (response) => {
        console.log(response);

        this.loadingSpinner = false;
        document.getElementById('loginButton')?.classList.remove("btn-disabled")
        // this.alertService.show("success", "Success")
        if (response.code == 0) {
          this.cookieService.set('token', response.access_token);
          // this.cookieService.set('token', response.access_token, undefined, '/', undefined, true, 'Lax');
          // this.router.navigate(['/dashboard']);
        } else {
          // console.log(response)
          this.alertService.show("error", response.message)
        }
      },
      (error) => {
        // console.log(error);
        this.loadingSpinner = false;
        document.getElementById('loginButton')?.classList.remove("btn-disabled")
        this.alertService.show("error", "There was an error while logging in")
      }
    );
  }

}
