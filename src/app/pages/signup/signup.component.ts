import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HttpClientModule],
  templateUrl: './signup.component.html',
  providers: [ApiService],
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  constructor(private apiService: ApiService) {}

  signup() {
    const userData = {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: ''
    };


    this.apiService.signup(userData).subscribe(
      (response) => {
        console.log('Signup successful', response);
      },
      (error) => {
        console.error('Signup failed', error);
      }
    );
  }
}
