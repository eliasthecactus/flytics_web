import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './password-reset.component.html',
  providers: [ApiService],
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {

  loadingSpinner: boolean = false;
  email: String = "";
  password: String = "";
  confirmPassword: String = "";
  token: String = "";
  resetPasswordType: boolean = false;

  resetNotificationTitle: String = "";
  resetNotificationText: String = "";
  resetNotificationButtonText: String = "";

  constructor(public alertService: AlertService, private activatedRoute: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['token']) {
          this.token = params['token'];
          this.resetPasswordType = true;
        } else {
          this.resetPasswordType = false;
        }
      }
    );
  }

  resetPassword() {
    var userData;
    if (!this.resetPasswordType) {
      userData = {
        email: this.email
      }
    } else {
      userData = {
        resetemail: this.email,
        token: this.token,
        password: this.password
      }
    }

    if (this.password != this.confirmPassword) {
      this.alertService.show("error", "Passwords do not match");
      return;
    }

    // console.log(userData);

    this.apiService.resetPassword(userData).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          this.alertService.show("success", response.message);
        } else {
          this.alertService.show("error", response.message);
        }
      },
      (error) => {
        this.alertService.show("error", "There was an error");
      }
    );

  }

}
