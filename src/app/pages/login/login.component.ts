import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  providers: [ApiService],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loadingSpinner: boolean = false;
  emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  userData: any = {
    email: '',
    password: ''
  };
  

  constructor(private apiService: ApiService, public alertService: AlertService) {

  }

  login() {


    this.loadingSpinner = true;
    document.getElementById('loginButton')?.classList.add("btn-disabled")

    this.apiService.signup(this.userData).subscribe(
      (response) => {
        console.log(response);
        this.loadingSpinner = false;
        document.getElementById('loginButton')?.classList.remove("btn-disabled")
        this.alertService.show("success", "Success")
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
