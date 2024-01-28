import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../services/logout.service';
import { TokenCheckerService } from '../../services/token-checker.service';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HttpClientModule],
  templateUrl: './dashboard.component.html',
  providers: [ApiService, TokenCheckerService],
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router, private logoutService: LogoutService, private tokenCheckerService: TokenCheckerService) {}

  logout() {
    this.logoutService.logout();
  }

  ngOnInit() {
    this.tokenCheckerService.checkExpired();
  }
  
}
