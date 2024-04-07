import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../services/logout.service';
import { TokenCheckerService } from '../../services/token-checker.service';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../services/alert.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HttpClientModule],
  templateUrl: './dashboard.component.html',
  providers: [ApiService, TokenCheckerService, LogoutService],
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  hasProfilePicture: boolean = false;
  avaterInformation: string = "";

  constructor(private router: Router, private logoutService: LogoutService, private tokenChecker: TokenCheckerService, public apiService: ApiService, public alertService: AlertService) {
    this.tokenChecker.redirectToLoginIfExpired();
  }

  logout() {
    this.apiService.logout().subscribe(
      (response) => {
        if (response.code == 0) {
          this.logoutService.logout();
        } else {
          this.alertService.show('error', 'There was an error while logging out');
        }
        // console.log(this.avaterInformation)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.apiService.getUserInformation().subscribe(
      (response) => {
        console.log(response)
        if (response.picture == null) {
          this.hasProfilePicture = false;
          this.avaterInformation = response.first_name;
        } else {
          this.hasProfilePicture = true;
          this.avaterInformation = response.picture;
        }
        // console.log(this.avaterInformation)
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
}
