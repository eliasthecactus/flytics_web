import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { LogoutService } from './logout.service';

@Injectable({
  providedIn: 'root'
})
export class TokenCheckerService {

  constructor(private apiService: ApiService, private router: Router, private alertService: AlertService, private logoutService: LogoutService) { }

  redirectToLoginIfExpired() {
    this.apiService.authPing().subscribe(
      (response) => {
        console.log(response);
        if (response.code == 99) {
          // console.log("logoff bc token is expired")
          this.logoutService.logout();
          this.alertService.show('error', 'You have been logged out due to inactivity')
        }
      },
      (error) => {
        this.router.navigate(['/login'])
        this.alertService.show('error', 'There was an issue. Please authenticate or try again')
      }
    );
  }

  checkTokenRefresh() {
    console.log("check if token has to be renewed")
  }

  redirectToDashboardIfLoggedin() {
    this.apiService.authPing().subscribe(
      (response) => {
        // console.log("redirection service: ", response)
        if (response.code == 0) {
          this.router.navigate(['/dashboard'])
        } else {
          this.logoutService.logout();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
